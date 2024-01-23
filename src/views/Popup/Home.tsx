import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { Icon } from '@iconify/react';
import SaveIcon from "@mui/icons-material/Save";
import authService from "api/authService";
import {
  AccessTokenResponse,
  DocumentCollection,
  Organization,
  OrganizationList,
  TagList,
} from "models/api/response.types";
import { ChromeMessage, Sender } from "types";
import baseUrl, { portUrl } from "utils/baseUrl";
import MenuListComposition from "./MenuListComposition";
import TreeViewComposition from "./TreeViewComposition";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Cite from "citation-js";
import axios from "axios";
import { parseBibTeX } from "utils/bibtex";
import handleAxiosError from "utils/handleAxiosError";
import TagInput from "./TagInput";

const Root = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  justifyContent: "space-between",
  height: "100%",
  "& .error": {
    position: "fixed",
    top: 0,
    left: 0,
    width: "-webkit-fill-available",
    height: "40px",
  },
  "& .selector-container": {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    "& .MuiInputLabel-root": {
      color: "#272727",
      position: "relative",
      transform: "none",
      marginBottom: "8px",
      fontWeight: 600
    },
  },
  "& .action-container": {
    marginTop: "1rem"
  },
  "& .loader": {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4rem",
    "& .icon": {
      width: "70px",
      height: "70px"
    },
    "& .loader-text": {
      margin: "0 2rem"
    }
  }
}));

type ProcessStatus = "not started" | "started" | "completed" | "error";

const defaultCollectionsTypes = [
  "__favorites",
  "__read_later",
  "Recently accessed",
  "Favorites",
  "Read later",
];

interface Props {
  cleanup: () => void;
}

const Home:React.FC<Props> = ({cleanup}) => {
  const theme = useTheme();
  const [user, setUser] = useState<AccessTokenResponse | undefined>(undefined);
  const [organizationList, setOrganizationList] = useState<OrganizationList>(
    []
  );
  const [collections, setCollections] = useState<DocumentCollection[]>([]);
  const [tags, setTags] = useState<TagList>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<
    Organization | undefined
  >(undefined);
  const [selectedCollection, setSelectedCollection] = useState<
    DocumentCollection | undefined
  >(undefined);

  const [showedButtonType, setShowedButtonType] = useState("reload");
  const [checkingRefType, setCheckingRefType] = useState(false);

  const [capture, setCapture] = useState<ProcessStatus>("not started");
  const [process, setProcess] = useState<ProcessStatus>("not started");
  const [upload, setUpload] = useState<ProcessStatus>("not started");
  const [showUploadCompleted, setShowUploadCompleted] = useState(false);
  const [documentTags, setDocumentTags] = useState<TagList>([]);

  const stopOnError =
    capture === "error" || process === "error" || upload === "error";
  const inProgress =
    !stopOnError && capture !== "not started" && upload !== "completed";

  const [uploadProgress, setUploadProgress] = useState(0);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const [referenceMetaObject, setReferenceMetaObject] = useState<{[k: string]: any} | undefined>(undefined);

  const isFirefox = /Firefox/i.test(window.navigator.userAgent);
  const isSafari = /Safari/i.test(window.navigator.userAgent);

  const customCollections = collections.filter(
    (collection) => !defaultCollectionsTypes.includes(collection.name)
  );

  useEffect(() => {
    if(upload === "completed"){
      setShowUploadCompleted(true);
      setTimeout(() => {
        setShowUploadCompleted(false)
      }, 3000)
    }
  }, [upload])

  useEffect(() => {
    chrome.storage.local.get(["user"], ({ user }) => {
      if (user) {
        setUser(user);
        chrome.storage.local.get(["organization"], ({ organization }) => {
          authService
            .fetchUserOrganizationList(user.id)
            .then(({ data }) => {
              setOrganizationList(data);
              let targetOrg = data[0];
              if (organization) {
                setSelectedOrganization(organization);
                targetOrg = organization;
              } else {
                chrome.storage.local.set({ organization: data[0] }, () => {
                  setSelectedOrganization(data[0]);
                });
              }
              authService
                .fetchDocumentCollections(targetOrg.id)
                .then(({ data }) => {
                  setCollections(data);
                })
                .catch((err) => {
                  handleAxiosError(err, cleanup);
                });
              authService
                .fetchTags(targetOrg.id)
                .then(({ data }) => {
                  setTags(data)
                })
                .catch((err) => {
                  handleAxiosError(err, cleanup);
                });
            })
            .catch((err) => {
              handleAxiosError(err, cleanup);
            });
          if (organization) {
            setSelectedOrganization(organization);
          }
        });
      }
    });

    const message: ChromeMessage = {
      from: Sender.React,
      action: "detect pdf",
    };

    const queryInfo: chrome.tabs.QueryInfo = {
      active: true,
      currentWindow: true,
    };

    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        const currentTabId = tabs[0].id as number;
        const currentTabUrl = tabs[0].url as string;
        setCheckingRefType(true);
        axios.post("https://cite.petal.org/api/citegen/query", {type: "article", query: currentTabUrl})
          .then((res) => {
          const { items } = res.data;
          const cslData = items[0].csljson;
          const cite = new Cite(cslData);
          const bibtexItem = cite.format("bibtex", { format: "text" }); // proper bibtex string
          const result = parseBibTeX(bibtexItem)
          const referenceMeta = {
              ...result[0].properties,
              citekey: result[0].citekey,
              entrytype: result[0].entrytype,
          };
          setCheckingRefType(false);
          setReferenceMetaObject(referenceMeta);
        }).catch((err) => {
          setReferenceMetaObject(undefined);
          handleAxiosError(err, cleanup);
        })
        chrome.tabs.sendMessage(currentTabId, message, (response) => {
          if (response !== "pdf" && response !== "html") {
            if (isFirefox) {
              chrome.storage.local.get(
                [`isFirefoxPdf-${currentTabId}`],
                (item) => {
                  if (item[`isFirefoxPdf-${currentTabId}`]) {
                    setShowedButtonType("pdf");
                  }
                }
              );
            } else {
              setShowedButtonType("synapse");
            }
          } else {
            setShowedButtonType(response);
          }
        });
      });
  }, [isFirefox]);

  const handleChangeOrganization = (target: Organization) => {
    chrome.storage.local.set({ organization: target }, () => {
      setSelectedOrganization(target);
      setCollections([]);
      setSelectedCollection(undefined);
      authService
        .fetchDocumentCollections(target.id)
        .then(({ data }) => {
          setCollections(data);
        })
        .catch((err) => {
          handleAxiosError(err, cleanup);
        });
      authService
        .fetchTags(target.id)
        .then(({ data }) => {
          setTags(data)
        })
        .catch((err) => {
          handleAxiosError(err, cleanup);
        });
    });
  };

  const handleChangeCollection = (target: DocumentCollection | undefined) => {
    setSelectedCollection(target);
  };

  const updateCollection = (documentId: number) => {
    if (!selectedCollection) {
      return;
    }
    const targetCollection = collections.find(
      (collection) => collection.id === selectedCollection.id
    );
    if (!targetCollection) {
      return;
    }
    const update = {
      id: targetCollection.id,
      document_ids: [...targetCollection.document_ids, documentId],
    };
    authService
      .updateDocumentCollection({ collections: [update] })
      .then((res) => {
        console.log(res);
      });
  };

  const updateDocumentTags = (documentId:number) => {
    if(documentTags.length === 0){
      return
    }
    authService.updateDocument(documentId, {
      tags_json: JSON.stringify(documentTags.map(tag => tag.id))
    })
  };

  const handleSaveReferenceMeta = () => {
    if (stopOnError) {
      reset();
    } else if (upload === "completed") {
      window.open(`${portUrl}/browse?organizationId=${selectedOrganization?.id}`, "_blank");
    } else {
      setCapture("completed");
      setProcess("completed");
      setUpload("started");
      if (!referenceMetaObject) {
        setUpload("error");
      } else {
        axios.post(`${baseUrl}/api/document/create_stubs`, {
          organization_id: selectedOrganization?.id,
          stubs: [{ meta_json: JSON.stringify(referenceMetaObject)}]
        }).then((res) => {
          updateCollection(res.data[0].id);
          updateDocumentTags(res.data[0].id);
          setUploadProgress(100)
          setUpload("completed");
        }).catch((err) => {
          setUpload("error");
        })
      }
    }
  }

  const handleSaveWebPage = () => {
    if (stopOnError) {
      reset();
      sendSaveWebPageMessage();
    } else if (upload === "completed") {
      window.open(`${portUrl}/browse/?organizationId=${selectedOrganization?.id}`, "_blank");
    } else {
      sendSaveWebPageMessage();
    }
  };

  const sendSaveWebPageMessage = () => {
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          const currentTabId = tabs[0].id as number;
          setCapture("started");
          chrome.tabs.sendMessage(
            currentTabId,
            {
              from: Sender.React,
              action: "capture web",
              payload: currentTabId,
            },
            async (response) => {
              const { action, payload } = response;
              if (action === "send html from content") {
                setCapture("completed");
                setProcess("started");
                const { filename, blobUrl, base64String } = payload;
                let file;
                if ((isFirefox || isSafari) && base64String) {
                  const base64Response = await fetch(base64String);
                  file = await base64Response.blob();
                } else if (blobUrl) {
                  file = await fetch(blobUrl).then((r) => r.blob());
                }
                if (file) {
                  setProcess("completed");
                  setUpload("started");
                  const formData = new FormData();

                  formData.append(
                    "organization_id",
                    `${selectedOrganization?.id}`
                  );
                  formData.append("file", file, filename);
                  formData.append("doctype", "html");

                  if (referenceMetaObject) {
                    formData.append("meta_json", JSON.stringify(referenceMetaObject));
                  }

                  const uploadXhr = new XMLHttpRequest();
                  uploadXhr.open("POST", `${baseUrl}/api/document/create`);
                  uploadXhr.setRequestHeader(
                    "Authorization",
                    `Bearer ${user?.access_token}`
                  );
                  uploadXhr.upload.onprogress = (e) => {
                    setUploadProgress((e.loaded / e.total) * 100);
                  };
                  uploadXhr.onloadend = (e) => {
                    setUploadProgress(100);
                  };
                  uploadXhr.onload = (e) => {
                    if (uploadXhr.readyState === 4) {
                      let response;
                      try {
                        response = JSON.parse(uploadXhr.responseText);
                      } catch (err) {
                        // eslint-disable-next-line no-console
                        console.error(err, uploadXhr.responseText);
                      }
                      if (uploadXhr.status === 200) {
                        setUpload("completed");
                        if (response) {
                          updateCollection(response.id);
                          updateDocumentTags(response.id);
                        }
                      } else if (uploadXhr.status === 409) {
                        setErrorMessage("Document already exists");
                        setUpload("error");
                      } else {
                        setErrorMessage(uploadXhr.response.error);
                        setUpload("error");
                      }
                    }
                  };
                  uploadXhr.onerror = (e) => {
                    setUpload("error");
                  };
                  uploadXhr.send(formData);
                } else {
                  setCapture("error");
                }
              } else {
                setCapture("error");
              }
            }
          );
        }
      );
  };

  const handleSavePdf = () => {
    if (stopOnError) {
      reset();
      sendUploadPdfMessage();
    } else if (upload === "completed") {
      window.open(`${portUrl}/browse?organizationId=${selectedOrganization?.id}`, "_blank");
    } else {
      sendUploadPdfMessage();
    }
  };

  const sendUploadPdfMessage = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      action: "upload pdf",
    };

    const queryInfo: chrome.tabs.QueryInfo = {
      active: true,
      currentWindow: true,
    };

    const uploadToSynapse = (file: Blob, filename: string) => {
      setProcess("completed");
      setUpload("started");
      const formData = new FormData();
      formData.append("organization_id", `${selectedOrganization?.id}`);
      formData.append("file", file, filename);
      formData.append("doctype", "pdf");

      const uploadXhr = new XMLHttpRequest();
      uploadXhr.open("POST", `${baseUrl}/api/document/create`);
      uploadXhr.setRequestHeader(
        "Authorization",
        `Bearer ${user?.access_token}`
      );
      uploadXhr.upload.onprogress = (e) => {
        setUploadProgress((e.loaded / e.total) * 100);
      };
      uploadXhr.onloadend = (e) => {
        setUploadProgress(100);
      };
      uploadXhr.onload = (e) => {
        if (uploadXhr.readyState === 4) {
          let response;
          try {
            response = JSON.parse(uploadXhr.responseText);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err, uploadXhr.responseText);
          }
          if (uploadXhr.status === 200) {
            setUpload("completed");
            if (response) {
              updateCollection(response.id);
              updateDocumentTags(response.id);
            }
          } else if (uploadXhr.status === 409) {
            setErrorMessage("Document already exists");
            setUpload("error");
            
          } else {
            setErrorMessage(uploadXhr.response.error);
            setUpload("error");
          }
        }
      };
      uploadXhr.onerror = (e) => {
        setUpload("error");
      };
      uploadXhr.send(formData);
    };

    const handleUploadPdfResponse = async (response: any) => {
      const { action, payload } = response;
      if (action === "send pdf from content") {
        setCapture("completed");
        setProcess("started");
        const { base64String, filename } = payload;
        const base64Response = await fetch(base64String);
        const file = await base64Response.blob();
        uploadToSynapse(file, filename);
      } else {
        setCapture("error");
      }
    };

    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        setCapture("started");
        const tab = tabs[0];
        const currentTabId = tab.id as number;
        if (isFirefox) {
          fetch(tabs[0].url as string)
            .then((response) => response.blob())
            .then((file) => {
              setCapture("completed");
              setProcess("started");
              uploadToSynapse(
                file,
                tab.url?.split("/").pop() || tab.title || ""
              );
            })
            .catch((error) => {
              setCapture("error");
            });
        } else {
          chrome.tabs.sendMessage(
            currentTabId,
            message,
            handleUploadPdfResponse
          );
        }
      });
  };

  const reset = () => {
    setCapture("not started");
    setProcess("not started");
    setUpload("not started");
    setUploadProgress(0);
    setErrorMessage("");
  };

  const getButtonText = (defaultButton: string) => {
    if (upload === "completed") {
      return "View in App";
    }
    if (stopOnError) {
      if (errorMessage === "Document already exists") {
        return "View in App";
      }
      return "Retry";
    }
    return defaultButton;
  };

  const reload = () => {
    chrome && chrome.tabs && chrome.tabs.reload();
    window.close();
  }

  let buttonText = "Reload the page to get the latest version";
  let buttonAction = reload;
  let buttonDisabled = false;
  if (checkingRefType) {
    buttonText = "Checking reference type...";
    buttonDisabled = true;
  } else {
    buttonDisabled = false;
    if (showedButtonType === "pdf") {
      buttonText = getButtonText("Upload PDF file to Petal")
      buttonAction = handleSavePdf;
    } else if (showedButtonType === "html") {
      if (referenceMetaObject && referenceMetaObject.entrytype !== "misc") {
        buttonText = getButtonText("Save embedded reference to Petal");
        buttonAction = handleSaveReferenceMeta;
      } else {
        buttonText = getButtonText("Save current web page to Petal")
        buttonAction = handleSaveWebPage;
      }
    }
  }

  return (
    <Root>
      {stopOnError && (
        <Alert
          severity="error"
          onClose={reset}
          className="error"
        >
          {errorMessage ? errorMessage : "Something went wrong, please try again."}
        </Alert>
      )}
       <Box className="selector-container">
        <FormControl variant="standard">
          <InputLabel
            shrink
          >
          Workspace:
          </InputLabel>
          <MenuListComposition
            list={organizationList}
            selected={selectedOrganization}
            onChange={handleChangeOrganization}
          />
        </FormControl>
        <FormControl variant="standard">
          <InputLabel
            shrink
          >
          Collection:
          </InputLabel>
          <TreeViewComposition
            list={customCollections}
            selected={selectedCollection}
            onChange={handleChangeCollection}
          />
        </FormControl>
        <FormControl variant="standard">
          <InputLabel
            shrink
          >
          Add tags to new document:
          </InputLabel>
          <TagInput 
            setValue={setDocumentTags}
            selectedTags={documentTags}
            dropDownTags={tags}
          />
        </FormControl>
       </Box>
       <Box className="action-container">
        {showedButtonType !== "invalid" ? (
            <Button
              fullWidth
              onClick={buttonAction}
              startIcon={
                upload === "completed" ? <ExitToAppIcon /> : <SaveIcon />
              }
              variant="contained"
              disabled={buttonDisabled}
              disableElevation
            >
              {buttonText}
            </Button>
          ) : (
            <Alert
              severity="error"
            >
              Invalid file type, please open a pdf file or a web page.
            </Alert>
          )}
          {((inProgress && !stopOnError) || showUploadCompleted) && (
            <Box 
              className="loader"
              sx={{
                transition: "all 0.3s ease-out",
                ...(!showUploadCompleted ? {
                  background: theme.background.main
                } : {
                  background: theme.palette.success.light
                })
              }}
            >
              {!showUploadCompleted ? (
                <>
                  <Box>
                    <Icon 
                      className="icon" 
                      icon="line-md:uploading-loop" 
                      style={{
                        color: theme.palette.primary.main
                      }}
                    />
                    <Typography 
                      variant="body1" 
                      fontWeight={600} 
                      textAlign="center"
                    >
                      {Math.floor(uploadProgress)}%
                    </Typography>
                  </Box>
                  <Typography className="loader-text" variant="body1" textAlign="center">
                    Do not close or navigate away while capturing; the capture process 
                    will be interrupted if you close the extension!
                  </Typography>
                </>
              ) : (
                <>
                  <Icon 
                    className="icon" 
                    icon="line-md:confirm"
                    style={{
                      color: theme.background.light
                    }}
                  />
                  <Typography 
                    className="loader-text" 
                    variant="body1" 
                    textAlign="center"
                    sx={{
                      color: theme.background.light
                    }}
                  >
                    The document has been loaded successfully. You can now access and view it in your workspace.
                  </Typography>
                </>
              )}
            </Box>
          )}
       </Box>
    </Root>
  );
};

export default Home;
