import { createTheme } from "@mui/material";

// module to add custom colors to theme
declare module "@mui/material/styles" {
  interface Theme {
    grey: {
      main: string;
      light: string;
    };
    red: {
      main: string;
      dark: string;
    };
    background: {
      main: string;
      secondary: string;
      light: string;
    };
    notice: {
      main: string;
    };
    menu: {
      selected: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    grey: {
      main: string;
      light: string;
    };
    red: {
      main: string;
      dark: string;
    };
    background: {
      main: string;
      secondary: string;
      light: string;
    };
    notice: {
      main: string;
    };
    menu: {
      selected: string;
    };
  }
}

const theme = createTheme({
  grey: {
    main: "rgb(190,190,190)",
    light: "rgb(240,240,240)",
  },
  red: {
    main: "#c33d33",
    dark: "#882a23",
  },
  background: {
    main: "#f6f8fc",
    secondary: "#ebf1fa",
    light: "#FFF",
  },
  notice: {
    main: "#f2e0a3",
  },
  // when menu is selected, backgorund button
  menu: {
    selected: "rgba(0, 0, 0, 0.04)",
  },
  palette: {
    mode: "light",
    primary: {
      main: "#3d5a80",
    },
    secondary: {
      main: "#01579b",
    },
  },
  spacing: 8,
  typography: {
    fontSize: 14,
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1400,
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          "&.MuiSvgIcon-fontSizeSmall": {
            width: "20px",
            height: "20px",
          },
          "&.MuiSvgIcon-fontSizeMedium": {
            width: "24px",
            height: "24px",
          },
          "&.MuiSvgIcon-fontSizeLarge": {
            width: "26px",
            height: "26px",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        popper: {
          zIndex: 15003,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "0 24px 16px 24px",
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          margin: 0,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: "14px",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "14px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontSize: "14px",
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          fontSize: "14px",
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          minHeight: "50px !important",
          "& .MuiAccordionSummary-content": {
            margin: 0,
          },
        },
      },
    },
  },
});

export default theme;
