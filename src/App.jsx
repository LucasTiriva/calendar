import React from "react";
import html2canvas from "html2canvas";

// type calendario = {
//   ano: number
//   mes: number
//   dias: {
//       nome: string
//       lastMonth: boolean
//   }[]
// }

function App() {
  const [mensagem, setMensagem] = React.useState("");
  const [calendario, setCalendario] = React.useState({});
  const calendarioRef = React.useRef();
  const downloadRef = React.useRef();

  const diasDaSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sabado",
  ];

  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const calcCalendar = (month, year) => {
    const days = new Date(year, month + 1, 0).getDate();
    const diasAntecedentes = new Date(year, month, 1).getDay();

    const response = {
      ano: year,
      mes: month,
      dias: new Array(days + diasAntecedentes).fill("").map((day, index) => {
        return {
          numero: index - diasAntecedentes + 1,
          nome: "",
          lastMonth: diasAntecedentes > index ? true : false,
        };
      }),
    };
    return response;
  };

  const handleProximo = () => {
    if (calendario.mes + 1 < 12)
      return setCalendario(calcCalendar(calendario.mes + 1, calendario.ano));

    setCalendario(calcCalendar(0, calendario.ano + 1));
  };

  const handleVoltar = () => {
    if (calendario.mes - 1 >= 0)
      return setCalendario(calcCalendar(calendario.mes - 1, calendario.ano));

    setCalendario(calcCalendar(11, calendario.ano - 1));
  };

  const handleOnChange = (event, index) => {
    const dias = calendario.dias;
    dias[index].nome = event.target.value;

    setCalendario({ ...calendario, dias });
  };

  const handleSalvar = async () => {
    if (!calendarioRef.current) return;
    const canvas = await html2canvas(calendarioRef.current);
    const image = canvas.toDataURL("image/jpeg", 2);

    downloadRef.current.download = "calendario.png";
    downloadRef.current.href = image;
    downloadRef.current.click();
  };

  React.useEffect(() => {
    const date = new Date();
    setCalendario(calcCalendar(date.getMonth(), date.getFullYear()));
  }, []);

  return (
    <div>
      Ano: {calendario.ano}
      mes: {meses[calendario.mes]}
      <div ref={calendarioRef} style={{ width: "80vw", padding: 10 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 14%)",
            gap: "5px",
          }}
        >
          {diasDaSemana.map((dia) => (
            <div
              key={dia}
              style={{
                background: "#E8EBF7",
                marginBottom: "10px",
                padding: "10px",
              }}
            >
              <span>{dia}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 14%)",
            gap: "5px",
            width: "100%",
          }}
        >
          {calendario.dias?.map((dia, index) => {
            return (
              <div
                key={index}
                style={{
                  height: "12vh",
                  background: "#E8EBF7",
                  display: "flex",
                  flexDirection: "column",
                  padding: "10px",
                }}
              >
                <span
                  style={{
                    width: "100%",
                    textAlign: "end",
                    transform: "translateX(-5px) translateY(+5px)",
                    marginBottom: 15,
                    fontSize: 16,
                  }}
                >
                  {!dia.lastMonth && dia.numero}
                </span>
                <input
                  style={{
                    fontSize: 18.5,
                    width: "100%",
                    height: "100%",
                    outline: "none",
                    background: " transparent",
                    border: "none",
                  }}
                  disabled={dia.lastMonth}
                  onChange={(event) => handleOnChange(event, index)}
                  value={dia.nome}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <span onClick={handleVoltar}>Voltar</span>
        <span onClick={handleProximo}>Proximo</span>
        <span onClick={handleSalvar}>Salvar</span>

        <a ref={downloadRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}

export default App;
