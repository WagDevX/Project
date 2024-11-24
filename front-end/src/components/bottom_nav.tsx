import { Form } from "react-router-dom";

export const BottomNav = () => {
  return (
    <div>
      <Form>
        <input type="text" placeholder="Digite sua mensagem" />
        <button type="submit">Enviar mensagem</button>
      </Form>
    </div>
  );
};
