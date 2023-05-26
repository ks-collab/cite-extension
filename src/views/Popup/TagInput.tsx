/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { Tag as ITag } from "models/api/response.types";
import Autocomplete, {
  AutocompleteRenderGetTagProps,
  AutocompleteRenderOptionState,
} from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import { ListItem, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import hexToHSL from "utils/hexToHSL";


// remove accents and other diacritics from a string. Good for comparisons
const norm = (value: string): string => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

const TagInput: React.FC<{
  selectedTags: any[];
  dropDownTags: readonly ITag[];
  setValue: (value: any[]) => void;
  setAlert?: (value: string) => void;
}> = ({
  selectedTags,
  dropDownTags,
  setValue,
  setAlert = (message: string) => {
    // eslint-disable-next-line no-console
    console.warn(message);
  },
}) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState("");

  // check if name is a current selected tag
  const nameIsSelected = (name: string): boolean => {
    return selectedTags.some((tag) => norm(tag.name) === norm(name));
  };

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    values: any[]
  ) => {
    const newValue = [...values];
    if (newValue.length > 0) {
      const lastValue = newValue[newValue.length - 1];
      if (!lastValue.id) {
        if (
          selectedTags.some(
            (tag) =>
              tag.name.toLowerCase() === lastValue.inputValue.toLowerCase()
          )
        ) {
          setAlert("Cannot create new tag. Reason: already selected.");
          newValue.splice(-1, 1);
        } else {
          newValue[newValue.length - 1] = {
            color: lastValue.color,
            name: lastValue.inputValue,
            id: -1,
          };
        }
      }
    }
    setValue(newValue);
  };

  const handleInputChange = (
    event: React.SyntheticEvent<Element, Event>,
    newInputValue: string
  ): void => {
    const tokens = newInputValue.split(",");
    if (tokens.length > 1) {
      if (tokens[0] === "") {
        setInputValue("");
        return;
      }
      if (selectedTags.some((tag) => norm(tag.name) === norm(tokens[0]))) {
        setAlert("The tag is already selected");
        setValue(selectedTags);
      } else {
        const matches = dropDownTags.filter(
          (tag) => norm(tag.name) === norm(tokens[0])
        );
        const newValue = [...selectedTags];
        if (matches.length > 0) {
            newValue.push(matches[0]);
        } else {
          newValue.push({ name: tokens[0], id: -1, color: "#D3D3D3" });
        }
        setValue(newValue);
      }
      setInputValue("");
    } else {
      setInputValue(newInputValue);
    }
  };

  const createTagFromInput = (inputText: string) => {
    if (inputText === "") {
      setInputValue("");
      return;
    }
    if (nameIsSelected(inputText)) {
      setAlert("The tag is already selected");
      setValue(selectedTags);
    } else {
      const matches = dropDownTags.filter(
        (tag) => norm(tag.name) === norm(inputText)
      );
      const newValue = [...selectedTags];
      if (matches.length > 0) {
        newValue.push(matches[0]);
      }
      setValue(newValue);
    }
    setInputValue("");
  };

  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: any,
  ): React.ReactNode => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <ListItem 
        disablePadding
        disableGutters
        {...props}
        sx={{
            minHeight: "32px !important"
        }}
    >
      <Box
        component="span"
        sx={{
          width: 16,
          height: 16,
          flexShrink: 0,
          borderRadius: "0.1rem",
          border: "1px solid rgba(127,127,127,.2)",
          mr: 1,
          mt: "2px",
        }}
        style={{ backgroundColor: option.color }}
      />
      <Box
        sx={{
          flexGrow: 1,
          fontSize: "14px",
          "& span": {
            color: theme.palette.mode === "light" ? "#586069" : "#8b949e",
          },
        }}
      >
        {option.name}
      </Box>
    </ListItem>
  );

  const renderTags = (
    tagValue: any[],
    getTagProps: AutocompleteRenderGetTagProps
  ) =>
    tagValue.map((option, index) => {
      if (option) {
        if (option.color) {
          const { l } = hexToHSL(option.color);
          const color = l < 60 ? "#fff" : "#000";
          return (
            <Chip
              size="small"
              label={option.name}
              style={{ color, backgroundColor: option.color }}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...getTagProps({ index })}
            />
          );
        }
      }
      return null;
    });

  return (
    <Box sx={{ width: "100%" }}>
      <Autocomplete
        forcePopupIcon={false}
        multiple
        color="primary"
        clearOnBlur={false}
        disableClearable
        value={selectedTags}
        inputValue={inputValue}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onKeyDown={(event) => {
          if (event.key === "Enter") createTagFromInput(inputValue);
        }}
        renderOption={renderOption}
        renderTags={renderTags}
        options={
          dropDownTags
            ? [...dropDownTags]
                .filter((tag) => !selectedTags.includes(tag))
                .sort((a, b) => {
                  // Display the selected tags first.
                  let ai = selectedTags.indexOf(a);
                  ai =
                    ai === -1
                      ? selectedTags.length + dropDownTags.indexOf(a)
                      : ai;
                  let bi = selectedTags.indexOf(b);
                  bi =
                    bi === -1
                      ? selectedTags.length + dropDownTags.indexOf(b)
                      : bi;
                  return ai - bi;
                })
            : []
        }
        noOptionsText="No tags"
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" size="small" />
        )}
      />
    </Box>
  );
};

export default TagInput;
