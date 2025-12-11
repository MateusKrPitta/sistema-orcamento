import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Slide from "@mui/material/Slide";
import Lines from "../lines";
import Label from "../label";
import ButtonClose from "../button-close";

const style = (width) => ({
  position: "absolute",
  top: 50,
  right: 0,
  width: width || 400,
  maxWidth: "90vw",
  height: "calc(100vh - 50px)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderTopLeftRadius: "16px",
  overflowY: "auto",
  "@media (max-width:600px)": {
    width: "90vw",
    top: 20,
    height: "calc(100vh - 20px)",
    borderTopLeftRadius: "12px",
  },
});
export default function ModalLateral({
  open,
  handleClose,
  tituloModal,
  conteudo,
  icon,
  width,
  tamanhoIcone,
  tamanhoTitulo,
  opcao,
  tamanhoOpcao,
}) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "start",
        }}
      >
        <Slide direction="left" in={open} mountOnEnter unmountOnExit>
          <Box sx={style(width)}>
            <Box sx={{ position: "absolute", top: 8, right: 8 }}>
              <ButtonClose funcao={handleClose} />
            </Box>

            <Lines
              display={"flex"}
              flexDirection={"column"}
              width={"100%"}
              alignItems={"start"}
              conteudo={
                <>
                  <Lines
                    width={"100%"}
                    display={"flex"}
                    alignItems={"start"}
                    conteudo={
                      <>
                        <Lines
                          width={tamanhoIcone || "10%"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          padding={"5px"}
                          backgroundColor={"#a3cb39"}
                          borderRadius={"5px"}
                          color={"#ffff"}
                          conteudo={<>{icon}</>}
                        />
                        <Label
                          fontSize={"15px"}
                          color={"#a3cb39"}
                          width={tamanhoTitulo}
                          fontWeight={"700"}
                          conteudo={tituloModal}
                        />
                        <Lines
                          width={tamanhoOpcao || "0%"}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          conteudo={opcao}
                        />
                      </>
                    }
                  />

                  <Lines
                    overflowY={"scroll"}
                    maxHeight={"500px"}
                    alignItems={"start"}
                    width={"100%"}
                    border={"1px solid #d9d9d9"}
                    borderRadius={"10px"}
                    height={"480px"}
                    padding={"10px"}
                    conteudo={<>{conteudo}</>}
                  />
                </>
              }
            />
          </Box>
        </Slide>
      </Modal>
    </div>
  );
}
