import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "rgb(39, 86, 155)", dark: "#3F5164" },
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: "normal",
        },
      },
    },
    MuiCircularProgress: {
      defaultProps: {
        disableShrink: true,
      },
    },
    MuiFilledInput: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {},
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: "dense",
      },
      styleOverrides: {
        root: {
          minHeight: 0,
        },
        input: {
          padding: "0.4rem 0 0.5rem",
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiListItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiFab: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTable: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: "2.6875rem",
          height: "2.6875rem",
          "& button": {
            minHeight: "2.6875rem",
            height: "2.6875rem",
            padding: "0",
            fontSize: "0.9rem",
            lineHeight: "1.25rem",
          },
          "& .": {
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#456",
            transition: "none",
          },
          "& .MuiTab-root": {
            color: "#333",
            "&:hover": {
              backgroundColor: "#eaeaea",
            },
          },
          "& .Mui-selected": {
            backgroundColor: "#fff",
            color: "#456",
          },
          "& .MuiTabs-indicator": {
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#456",
            transition: "none",
          },
        },
      },
    },
    MuiTab: {
      // defaultProps: {
      //   disableRipple: true,
      // },
    },
    MuiMenu: {
      defaultProps: {
        MenuListProps: {
          // disablePadding: true,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: "0.5rem 0.8rem",
        },
      },
    },
    MuiListItemText: {
      defaultProps: {
        primaryTypographyProps: {
          variant: "body2",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        padding: {
          padding: "0",
        },
      },
    },
    MuiInput: {
      defaultProps: {
        size: "small",
        margin: "dense",
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "filled",
        size: "small",
        margin: "dense",
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
    MuiToolbar: {
      defaultProps: {
        variant: "dense",
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          "&$expanded": {
            margin: "0",
            boxShadow: "none",
          },
          "&:before": {
            top: "0",
          },
          boxShadow: "none",
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: "0.5rem",
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: "0rem 0.75rem",
          minHeight: "0",
          "&$expanded": {
            minHeight: "0",
            margin: "0",
          },
          "&:hover": {
            background: "#ebeeee",
          },
          background: "#f3f5f5",
          color: "#303030",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        },
        content: {
          margin: "0",
          "&$expanded": {
            margin: "0",
          },
        },
      },
    },
  },
});

export default theme;
