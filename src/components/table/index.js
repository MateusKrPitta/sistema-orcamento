import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Box,
  Checkbox,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { maskCPF } from "../../utils/formatCPF";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import { Print, SwapHoriz } from "@mui/icons-material";
import { motion } from "framer-motion";
import "./table.css";

const TableComponent = ({
  rows,
  headers,
  actionCalls = {},
  actionsLabel,
  maxHeight,
  selectable = false,
  onSelectionChange,
  showPagination = true,
  paginaAtual = 0,
  limitePorPagina = 10,
  totalRegistros = 0,
  onMudarPagina,
  onMudarLimitePorPagina,
}) => {
  const [selected, setSelected] = useState([]);
  const hasActions = Object.keys(actionCalls).length > 0;
  const actionTypes = Object.keys(actionCalls);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  let headersList = [...headers];
  if (selectable) {
    headersList = [
      {
        key: "selection",
        label: "Selecionar",
        sort: true,
      },
      ...headers,
    ];
  }

  if (hasActions) {
    headersList = headersList.concat([
      {
        key: "actions",
        label: actionsLabel,
      },
    ]);
  }

  const handleChangePage = (event, newPage) => {
    if (onMudarPagina) {
      onMudarPagina(event, newPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    if (onMudarLimitePorPagina) {
      onMudarLimitePorPagina(event);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((row) => row.id);
      setSelected(newSelected);
      if (onSelectionChange) {
        onSelectionChange(newSelected);
      }
      return;
    }
    setSelected([]);
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    if (onSelectionChange) {
      onSelectionChange(newSelected);
    }
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const numSelected = selected.length;

  const allSelectedOnPage = numSelected > 0 && numSelected === rows.length;

  const renderActions = (row) => {
    let actions = {
      confirm: row.status !== "Cadastrado" && (
        <IconButton
          onClick={() => actionCalls.confirm(row)}
          title="Confirmar Registro"
          className="confirm-button"
          sx={{
            color: "#a3cb39",
            border: "1px solid #a3cb39",
            "&:hover": {
              color: "#fff",
              backgroundColor: "#a3cb39",
              border: "1px solid #005a2a",
            },
          }}
        >
          <CheckCircleOutlineIcon fontSize={"small"} />
        </IconButton>
      ),
      view: (
        <IconButton
          onClick={() => actionCalls.view(row)}
          title="Visualizar Dados"
          className="view-button"
          id={`view-button-${row.id}`}
          sx={{
            color: "#a3cb39",
            border: "1px solid #a3cb39",
            "&:hover": {
              color: "#fff",
              backgroundColor: "#a3cb39",
              border: "1px solid #005a2a",
            },
          }}
        >
          <VisibilityOutlinedIcon fontSize={"small"} />
        </IconButton>
      ),
      print: (
        <IconButton
          onClick={() => actionCalls.view(row)}
          title="Imprimir"
          className="view-button"
          id={`view-button-${row.id}`}
          sx={{
            color: "#a3cb39",
            border: "1px solid #a3cb39",
            "&:hover": {
              color: "#fff",
              backgroundColor: "#a3cb39",
              border: "1px solid #005a2a",
            },
          }}
        >
          <Print fontSize={"small"} />
        </IconButton>
      ),
      edit: (
        <IconButton
          id={`edit-button-${row.id}`}
          onClick={() => actionCalls.edit(row)}
          title="Editar Dados"
          className="view-button"
          disabled={!row.ativo}
          sx={{
            color: !row.ativo ? "#ccc" : "#a3cb39",
            border: `1px solid ${!row.ativo ? "#ccc" : "#a3cb39"}`,
            "&:hover": !row.ativo
              ? {}
              : {
                  color: "#fff",
                  backgroundColor: "#a3cb39",
                  border: "1px solid #005a2a",
                },
            "&.Mui-disabled": {
              color: "#ccc",
              border: "1px solid #ccc",
            },
          }}
        >
          <EditIcon fontSize={"small"} />
        </IconButton>
      ),
      delete: row.status !== "Pagamento Realizado" && (
        <IconButton
          id={`delete-button-${row.id}`}
          onClick={() => actionCalls.delete(row)}
          title="Excluir Registro"
          className="delete-button"
          sx={{
            color: "#9a0000",
            border: "1px solid #9a0000",
            "&:hover": {
              color: "#fff",
              backgroundColor: "#9a0000",
              border: "1px solid #b22222",
            },
          }}
        >
          <DeleteOutlineIcon fontSize={"small"} />
        </IconButton>
      ),
      toggleStatus: (
        <IconButton
          id={`toggle-status-button-${row.id}`}
          onClick={() => actionCalls.toggleStatus(row)}
          title={row.ativo ? "Inativar" : "Reativar"}
          className="toggle-status-button"
          sx={{
            color: row.ativo ? "#ff9800" : "#a3cb39",
            border: `1px solid ${row.ativo ? "#ff9800" : "#a3cb39"}`,
            "&:hover": {
              color: "#fff",
              backgroundColor: row.ativo ? "#ff9800" : "#a3cb39",
              border: `1px solid ${row.ativo ? "#e68a00" : "#005a2a"}`,
            },
          }}
        >
          {row.ativo ? (
            <BlockOutlinedIcon fontSize={"small"} />
          ) : (
            <CheckCircleOutlineIcon fontSize={"small"} />
          )}
        </IconButton>
      ),
      reativar: !row.ativo && (
        <IconButton
          id={`toggle-status-button-${row.id}`}
          onClick={() => actionCalls.reativar(row)}
          title="Reativar Registro"
          className="reactivate-button"
          sx={{
            color: "#a3cb39",
            border: "1px solid #a3cb39",
            "&:hover": {
              color: "#fff",
              backgroundColor: "#a3cb39",
              border: "1px solid #005a2a",
            },
          }}
        >
          <CheckCircleOutlineIcon fontSize={"small"} />
        </IconButton>
      ),
      option: (
        <IconButton
          onClick={() => actionCalls.option(row)}
          title="Iniciar Novo Contrato"
          className="view-button"
          sx={{
            color: "#a3cb39",
            border: "1px solid #a3cb39",
            "&:hover": {
              color: "#fff",
              backgroundColor: "#a3cb39",
              border: "1px solid #005a2a",
            },
          }}
        >
          <AddCircleOutlineIcon fontSize={"small"} />
        </IconButton>
      ),
      transferir: (
        <IconButton
          onClick={() => actionCalls.transferir(row)}
          title="Transferir"
          className="view-button"
          sx={{
            color: "#a3cb39",
            border: "1px solid #a3cb39",
            "&:hover": {
              color: "#fff",
              backgroundColor: "#a3cb39",
              border: "1px solid #005a2a",
            },
          }}
        >
          <SwapHoriz fontSize={"small"} />
        </IconButton>
      ),
    };

    return actionTypes.map((action) => {
      const ActionButton = actions[action];
      return ActionButton ? <span key={action}>{ActionButton}</span> : null;
    });
  };

  return (
    <Box>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.9 }}
        className="w-full"
      >
        {selectable && numSelected > 0 && (
          <Box
            sx={{
              p: 1,
              backgroundColor: "#a3cb39",
              color: "#ffffff",
              borderRadius: 1,
              mb: 1,
            }}
          >
            <Typography variant="body2">
              {numSelected} item(s) selecionado(s)
            </Typography>
          </Box>
        )}
      </motion.div>

      <TableContainer
        component={Paper}
        style={{
          maxHeight: maxHeight || "400px",
          overflowY: "auto",
          overflowX: "none",
        }}
        className="scrollbar"
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headersList.map(
                ({ key, label, sort }) =>
                  sort !== false && (
                    <TableCell
                      key={key}
                      style={{
                        fontWeight: "bold",
                        textAlign:
                          key === "actions" || key === "selection"
                            ? "center"
                            : "left",
                        width: key === "selection" ? "60px" : "auto",
                      }}
                    >
                      {key === "selection" && selectable ? (
                        <Checkbox
                          indeterminate={numSelected > 0 && !allSelectedOnPage}
                          checked={allSelectedOnPage}
                          onChange={handleSelectAllClick}
                          color="primary"
                        />
                      ) : (
                        label
                      )}
                    </TableCell>
                  )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => {
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${rowIndex}`;

              return (
                <TableRow
                  key={rowIndex}
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
                >
                  {headersList.map(
                    ({ key, sort }) =>
                      sort !== false &&
                      (key === "selection" && selectable ? (
                        <TableCell key={key} padding="checkbox" align="center">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                            onClick={(event) => handleClick(event, row.id)}
                            color="primary"
                          />
                        </TableCell>
                      ) : key === "Tipo" ? (
                        <TableCell
                          key={key}
                          style={{
                            backgroundColor:
                              row.Tipo === "Entrada"
                                ? "#a3cb39"
                                : row.Tipo === "Saída"
                                ? "#ed4949"
                                : "transparent",
                            color: "white",
                            fontSize: "12px",
                          }}
                        >
                          {row[key] || "-"}
                        </TableCell>
                      ) : key === "actions" && hasActions ? (
                        <TableCell
                          key={key}
                          style={{
                            display: "flex",
                            gap: 5,
                            justifyContent: "center",
                            backgroundColor:
                              row.statusStyle === "vendido-descarte-manutencao"
                                ? "#ffebee"
                                : "inherit",
                          }}
                        >
                          {renderActions(row)}
                        </TableCell>
                      ) : key === "cpf" ? (
                        <TableCell style={{ fontSize: "12px" }} key={key}>
                          {maskCPF(row[key])}
                        </TableCell>
                      ) : (
                        <TableCell
                          style={{
                            fontSize: "12px",
                            backgroundColor:
                              row.statusStyle === "vendido-descarte-manutencao"
                                ? "#ffebee"
                                : "inherit",
                          }}
                          key={key}
                        >
                          {row[key] || "-"}
                        </TableCell>
                      ))
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {showPagination && (
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={totalRegistros}
          rowsPerPage={limitePorPagina}
          page={paginaAtual}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
        />
      )}
    </Box>
  );
};

export default TableComponent;
