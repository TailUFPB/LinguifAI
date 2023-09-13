import { Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ComponenteTeste() {
  const [contador, setContador] = useState(0);
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => {
        if (contador >= 5) navigate("/404");
        setContador((prev) => prev + 1);
      }}
    >
      Cliquemaeae
      {contador}
    </Button>
  );
}
