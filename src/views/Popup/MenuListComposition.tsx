import React, { useRef, useState } from "react";
import {
  Popper,
  ClickAwayListener,
  MenuList,
  Typography,
  styled,
  Box,
  useTheme,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";


const Container = styled(Box)(({theme}) => ({
    background: theme.background.light,
    border: `1px solid rgba(0, 0, 0, 0.23)`,
    padding: "5px 10px",
    cursor: "pointer",
    "&:hover": {
      border: `1px solid rgba(0, 0, 0, 0.87)`,
    },
    "&.expanded": {
      border: `1px solid ${theme.palette.primary.main}`,
    },
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
    borderRadius: "4px",
    alignItems: "center",
    "& .title": {
      color: theme.palette.text.primary,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
}));

interface Props<T> {
  list: T[];
  onChange: (target: T) => void;
  selected?: T;
}

const MenuListComposition = <T extends { id: number; name?: string }>({
  list,
  onChange,
  selected,
}: Props<T>) => {
  const theme = useTheme();
  const [menuOpen, setMenuOpen] = useState<null | HTMLElement>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleChangeSelection = (
    item: T
  ) => {
    if (selected === undefined || item.id !== selected.id) {
      onChange(item);
    }
    setMenuOpen(null)
  };

  return (
    <>
      <Container
        ref={anchorRef}
        id="composition-button"
        onClick={(e) => {
          setMenuOpen(e.currentTarget);
        }}
        className={menuOpen ? "expanded" : ""}
      >
        <Typography variant="body2" className="title">
          {selected?.name || "Please select an organization"}
        </Typography>
        <KeyboardArrowDownIcon
          color="action"
          sx={
            menuOpen
              ? {
                  transform: "rotate(180deg)",
                }
              : {}
          }
        />
      </Container>
      {menuOpen && (
        <ClickAwayListener 
          onClickAway={() => {
            setMenuOpen(null)
          }}
        >
          <Popper
            open={!!menuOpen}
            anchorEl={menuOpen}
            placement="bottom-start"
            sx={{
              borderRadius: "4px",
              border: `1px solid #E9E9E9`,
              boxShadow: `0 0.5rem 1rem rgba(149, 157, 165, 0.2)`,
              maxHeight: "160px",
              width: anchorRef.current
                ? `${anchorRef.current.offsetWidth}px`
                : "300px",
              zIndex: 1301,
              backgroundColor: theme.background.light,
              overflow: "auto",
            }}
          >
            <MenuList
              id="composition-menu"
              aria-labelledby="composition-button"
              dense
            >
              {list.map((item) => (
                <ListItemButton
                  sx={{
                    padding: "0px 16px",
                    height: "32px",
                  }}
                  selected={selected?.name === item.name}
                  key={item.id}
                  onClick={() => handleChangeSelection(item)}
                >
                  <ListItemText>
                    <Typography variant="body2">{item.name}</Typography>
                  </ListItemText>
                </ListItemButton>
              ))}
            </MenuList>
          </Popper>
      </ClickAwayListener>
      )}
    </>
  );
};

export default MenuListComposition;
