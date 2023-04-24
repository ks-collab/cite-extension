import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  LinearProgressProps,
  styled,
  Typography,
} from "@mui/material";
import { LoadingButton, TreeItem } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import authService from "api/authService";
import {
  AccessTokenResponse,
  DocumentCollection,
  Organization,
  OrganizationList,
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

const PREFIX = "Home";
const classes = {
  root: `${PREFIX}-root`,
  selectors: `${PREFIX}-selectors`,
  selector: `${PREFIX}-selector`,
  slash: `${PREFIX}-slash`,
  progress: `${PREFIX}-progress`,
  action: `${PREFIX}-action`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
  },
  [`& .${classes.action}`]: {
    marginTop: "1.5rem",
    // marginBottom: "2rem",
    width: "100%",
    textAlign: "start",
  },
  [`& .${classes.selectors}`]: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  [`& .${classes.selector}`]: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    marginTop: "0.5rem",
    marginBottom: "0rem",
  },
  [`& .${classes.slash}`]: {
    margin: "auto 0.25rem",
    fontSize: "0.875rem",
  },
  [`& .${classes.progress}`]: {
    width: "100%",
  },
}));

const DropDownWrapper = styled("div")(
  ({ theme }) => `
    margin-left: auto;
  `
);

type ProcessStatus = "not started" | "started" | "completed" | "error";

const defaultCollectionsTypes = [
  "__favorites",
  "__read_later",
  "Recently accessed",
  "Favorites",
  "Read later",
];

const LinearProgressWithLabel = (
  props: LinearProgressProps & { value: number }
) => {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
};

interface Props {
  cleanup: () => void;
}

const Home:React.FC<Props> = ({cleanup}) => {
  const [user, setUser] = useState<AccessTokenResponse | undefined>(undefined);

  const [organizationList, setOrganizationList] = useState<OrganizationList>(
    []
  );
  const [collections, setCollections] = useState<DocumentCollection[]>([]);

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
        axios.post("https://cite.petal-dev.org/api/citegen/query", {type: "article", query: currentTabUrl})
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
    });
  };

  const handleChangeCollection = (target: DocumentCollection) => {
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
                        }
                      } else if (uploadXhr.status === 409) {
                        setUpload("error");
                        setErrorMessage("Document already exists");
                      } else {
                        setUpload("error");
                        setErrorMessage(uploadXhr.response.error);
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
            }
          } else if (uploadXhr.status === 409) {
            setUpload("error");
            setErrorMessage("Document already exists");
          } else {
            setUpload("error");
            setErrorMessage(uploadXhr.response.error);
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

  // const CustomTreeItem = (props: TreeItemProps) => (
  //   <TreeItem ContentComponent={CollectionTreeItem} {...props} />
  // );

  const renderTreeItem = (item: DocumentCollection, lvl: number) => {
    if (collections) {
      const children = collections.filter((coll) => {
        return coll.parent_id === item.id;
      });

      const generateSubLogic = () => {
        return children.map((child) => renderTreeItem(child, lvl + 1));
      };

      if (item.parent_id > 0 && lvl === 0) {
        return null;
      }

      return (
        <TreeItem key={item.id} nodeId={item.id.toString()} label={item.name}>
          {generateSubLogic()}
        </TreeItem>
      );
    }
    return null;
  };

  const reload = () => {
    chrome && chrome.tabs && chrome.tabs.reload();
    window.close();
  }

  let buttonText = "Reload the page to capture the latest version of the document";
  let buttonAction = reload;
  let buttonDisabled = false;
  if (checkingRefType) {
    buttonText = "Checking reference type...";
    buttonDisabled = true;
  } else {
    buttonDisabled = false;
    if (showedButtonType === "pdf") {
      buttonText = getButtonText("Upload PDF file to Petal Cite")
      buttonAction = handleSavePdf;
    } else if (showedButtonType === "html") {
      if (referenceMetaObject && referenceMetaObject.entrytype !== "misc") {
        buttonText = getButtonText("Save embedded reference to Petal Cite");
        buttonAction = handleSaveReferenceMeta;
      } else {
        buttonText = getButtonText("Save current web page to Petal Cite")
        buttonAction = handleSaveWebPage;
      }
    }

  }

  return (
    <Root className={classes.root}>
      <div className={classes.selectors}>
        <div className={classes.selector}>
          <Typography
            variant="subtitle2"
            sx={{ my: "auto", mr: "0.5rem", width: "125px" }}
          >
            {" "}
            Workspace:{" "}
          </Typography>
          <DropDownWrapper>
            <MenuListComposition
              list={organizationList}
              selected={selectedOrganization}
              onChange={handleChangeOrganization}
            />
          </DropDownWrapper>
        </div>
        <div className={classes.selector}>
          <Typography
            variant="subtitle2"
            sx={{ my: "auto", mr: "0.5rem", width: "125px" }}
          >
            {" "}
            Collection:{" "}
          </Typography>
          <DropDownWrapper>
            <TreeViewComposition
              list={customCollections}
              selected={selectedCollection}
              onChange={handleChangeCollection}
            />
          </DropDownWrapper>
        </div>
      </div>

      <div className={classes.action}>
        {showedButtonType !== "invalid" && (
          <LoadingButton
            onClick={buttonAction}
            loading={inProgress}
            loadingPosition="start"
            startIcon={
              upload === "completed" ? <ExitToAppIcon /> : <SaveIcon />
            }
            variant="contained"
            disabled={buttonDisabled}
            disableElevation
            loadingIndicator={<CircularProgress color="inherit" size={12} />}
          >
            {buttonText}
          </LoadingButton>
        )}
        {showedButtonType === "invalid" && (
          <Typography variant="subtitle2" sx={{ mb: "0.75rem", mr: "0.5rem" }}>
            {" "}
            Invalid file type, please open a pdf file or a web page.{" "}
          </Typography>
        )}
        {inProgress && (
          <Alert severity="warning">
            Do not close or navigate away while capturing; the capture process
            will be interrupted if you close the extension!
          </Alert>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "start",
          marginTop: "0.75rem",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          {capture === "not started" && (
            <div style={{ marginBottom: 12 }}></div>
          )}
          {capture !== "not started" && capture !== "completed" && (
            <Typography variant="subtitle2" sx={{ my: "auto", mr: "0.5rem" }}>
              Capturing content
            </Typography>
          )}
          {capture !== "not started" && capture !== "completed" && (
            <Typography variant="subtitle2" sx={{ my: "auto" }}>
              ...
            </Typography>
          )}
          {capture === "completed" && (
            <Typography variant="subtitle2" sx={{ my: "auto", mr: "0.5rem" }}>
              Captured content
            </Typography>
          )}
          {capture === "completed" && (
            <CheckIcon sx={{ my: "auto", ml: "1rem" }} color="success" />
          )}
          {capture === "error" && (
            <ClearIcon sx={{ my: "auto", ml: "1rem" }} color="error" />
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {process === "not started" && (
            <div style={{ marginBottom: 12 }}></div>
          )}
          {process !== "not started" && process !== "completed" && (
            <Typography variant="subtitle2" sx={{ my: "auto", mr: "0.5rem" }}>
              Processing data
            </Typography>
          )}
          {process !== "not started" && process !== "completed" && (
            <Typography variant="subtitle2" sx={{ my: "auto" }}>
              ...
            </Typography>
          )}
          {process === "completed" && (
            <Typography variant="subtitle2" sx={{ my: "auto", mr: "0.5rem" }}>
              Processed data
            </Typography>
          )}
          {process === "completed" && (
            <CheckIcon sx={{ my: "auto", ml: "1rem" }} color="success" />
          )}
          {process === "error" && (
            <ClearIcon sx={{ my: "auto", ml: "1rem" }} color="error" />
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {upload === "not started" && <div style={{ marginBottom: 12 }}></div>}
          {upload !== "not started" && upload !== "completed" && (
            <Typography variant="subtitle2" sx={{ my: "auto", mr: "0.5rem" }}>
              Uploading to Project
            </Typography>
          )}
          {upload !== "not started" && upload !== "completed" && (
            <Typography variant="subtitle2" sx={{ my: "auto" }}>
              ...
            </Typography>
          )}
          {upload === "completed" && (
            <Typography variant="subtitle2" sx={{ my: "auto", mr: "0.5rem" }}>
              Uploaded to Project
            </Typography>
          )}
          {upload === "completed" && (
            <CheckIcon sx={{ my: "auto", ml: "1rem" }} color="success" />
          )}
          {upload === "error" && (
            <ClearIcon sx={{ my: "auto", ml: "1rem" }} color="error" />
          )}
        </div>
        {errorMessage !== "" && (
          <Typography variant="subtitle2" sx={{ my: "auto", color: "red" }}>
            {" "}
            {errorMessage}{" "}
          </Typography>
        )}
      </div>
      {(showedButtonType === "pdf" || showedButtonType === "html") &&
        (upload === "started" || upload === "completed") && (
          <div className={classes.progress}>
            <LinearProgressWithLabel value={uploadProgress} />
          </div>
        )}
    </Root>
  );
};

export default Home;
