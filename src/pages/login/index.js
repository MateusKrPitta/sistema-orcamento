import React, { useState } from "react";
import {
  Mail,
  Password,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import packageJson from "../../../package.json";
import Computadores from "../../assets/png/computador.png";
import LogoOficial from "../../assets/png/logo.png";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Simulando um login (substitua com sua lógica real)
    setLoading(true);

    // Simula uma requisição de API
    setTimeout(() => {
      // Aqui você faria a validação do login
      // Se login for bem-sucedido:
      navigate("/dashboard");
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box
      className="login-container"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #a3cb39 0%, #7fa52c 50%, #5f7527 100%)",
        backgroundSize: "400% 400%",
        animation: "gradient 15s ease infinite",
      }}
      onKeyPress={handleKeyPress}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          borderRadius: 3,
          width: "60%",
          maxWidth: 400,
          display: "flex",
          gap: "20px",
          flexDirection: "column",
          bgcolor: "white",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Box
          sx={{
            mb: 2,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "30%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={LogoOficial}
              alt="Logo"
              style={{
                width: "100%",
                padding: "10px",
              }}
            />
          </div>
        </Box>

        <label className="text-sm text-black">
          Faça login para acessar o sistema
        </label>

        <TextField
          fullWidth
          label="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="small"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Mail fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Senha"
          type={showPassword ? "text" : "password"}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          size="small"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? (
                    <VisibilityOffOutlined fontSize="small" />
                  ) : (
                    <VisibilityOutlined fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
            startAdornment: (
              <InputAdornment position="start">
                <Password fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          onClick={handleLogin}
          variant="contained"
          disabled={loading}
          sx={{
            py: 1.5,
            mt: 1,
            mb: 2,
            background: "linear-gradient(135deg, #a3cb39 0%, #5f7527 100%)",
            fontWeight: "600",
            fontSize: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(163, 203, 57, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #5f7527 0%, #a3cb39 100%)",
              boxShadow: "0 6px 12px rgba(163, 203, 57, 0.4)",
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
        </Button>

        <label
          className="text-xs mt-4 font-medium"
          style={{ color: "#718096" }}
        >
          Versão {packageJson.version}
        </label>
      </Paper>
      <Paper
        sx={{
          p: 4,

          borderTopRightRadius: "10%",
          borderBottomRightRadius: "10%",
          width: "40%",
          maxWidth: 400,
          display: "flex",
          gap: "20px",
          flexDirection: "column",
          bgcolor: "white",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        }}
      >
        <label className="font-bold text-2xl text-primary ">
          Sistema de Orçamentos
        </label>
        <img src={Computadores}></img>
      </Paper>

      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </Box>
  );
};

export default Login;
