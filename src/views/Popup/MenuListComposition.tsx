import * as React from "react";
import {
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Typography,
  styled,
} from "@mui/material";
import { grey } from "utils/color";

const StyledButton = styled("button")(
  ({ theme }) => `
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #aaaaaa;
  border-radius: 0.75em;
  width: 368px;
  padding: 8px;
  text-align: left;
  line-height: 1.15;
  margin-left: auto;
  color: ${grey[900]};

  &:hover {
    cursor: pointer
  }

  &.expanded {
    background: #fff;
    border: 1px solid #27569b;
    &::after {
      content: '▾';
    }
  }

  &::after {
    content: '▾';
    float: right;
  }

  div {
    width: 95%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    vertical-align: bottom;
  }
  `
);

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
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const handleChangeSelection = (
    event: Event | React.SyntheticEvent,
    item: T
  ) => {
    if (selected === undefined || item.id !== selected.id) {
      onChange(item);
    }
    handleClose(event);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <StyledButton
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? "composition-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        className={open ? "expanded" : ""}
      >
        <div>{selected?.name || "..."}</div>
      </StyledButton>
      <Popper
        style={{ zIndex: 1000 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: "left top",
            }}
          >
            <Paper style={{ maxHeight: 160, overflow: "auto", width: 368 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                  dense
                >
                  {list.map((item) => (
                    <MenuItem
                      sx={{
                        padding: "0.25rem 0.8rem",
                        minHeight: "1.5rem",
                      }}
                      onClick={(event) => handleChangeSelection(event, item)}
                      key={item.id}
                      dense
                    >
                      <Typography variant="inherit" noWrap>
                        {item.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default MenuListComposition;
