import { useState } from "react";

function ClienteAutocomplete() {

  const [cliente, setCliente] = useState("");

  return (
    <div>

      <label>Cliente</label>

      <input
        type="text"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
        placeholder="Digite o nome do cliente"
      />

    </div>
  );
}

export default ClienteAutocomplete;