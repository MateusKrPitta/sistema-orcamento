import React from "react";
import { Modal, Box, Typography, Grow } from "@mui/material";
import Lines from "../lines";
import Label from "../label";
import ButtonClose from "../button-close";

const CentralModal = ({
  open,
  onClose,
  title,
  children,
  icon,
  width,
  maxHeight,
  tamanhoTitulo,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
      aria-labelledby="central-modal-title"
      aria-describedby="central-modal-description"
      sx={{
        display: "flex",
        zIndex: 9999,
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: "10px", sm: "20px" },
      }}
    >
      <Grow in={open}>
        <Box
          sx={{
            position: "relative",
            width: { xs: "95%", sm: width || "450px" },
            maxWidth: "95vw",
            maxHeight: maxHeight || "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            overflowY: "auto",
            margin: "auto",
          }}
        >
          <Box sx={{ position: "absolute", top: 8, right: 8 }}>
            <ButtonClose funcao={onClose} />
          </Box>

          <Typography
            id="central-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            <Lines
              gap={"5px"}
              conteudo={
                <>
                  <label
                    style={{
                      padding: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#a3cb39",
                      color: "#ffff",
                      borderRadius: "5px",
                    }}
                    l
                  >
                    {icon}
                  </label>

                  <Label
                    fontWeight={700}
                    width={tamanhoTitulo || "75%"}
                    fontSize={"15px"}
                    conteudo={<>{title}</>}
                  />
                </>
              }
            />
          </Typography>

          <Typography id="central-modal-description" sx={{ mb: 2 }}>
            {children}
          </Typography>
        </Box>
      </Grow>
    </Modal>
  );
};

export default CentralModal;
