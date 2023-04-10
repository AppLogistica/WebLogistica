export function Menu() {

    return (
        <div className="menu" style={{ marginBottom: "2rem", backgroundColor: "#242424", display: "flex", justifyContent: "space-evenly" }}>
            <a href="/main"
                style={{
                    textDecoration: "none",
                    textAlign: "center"
                }}>
                <div
                    style={{
                        backgroundColor: 'white',
                        width: "140%",
                        height: "140%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "8px"
                    }}>Inicio</div></a>

            <a href="/email"
                style={{
                    textDecoration: "none",
                    textAlign: "center"
                }}>
                <div
                    style={{
                        backgroundColor: 'white',
                        width: "140%",
                        height: "140%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "8px"
                    }}>Email</div> </a>

            <a href="/fornecedores"
                style={{
                    textDecoration: "none",
                    textAlign: "center"
                }}>
                <div style={{
                    backgroundColor: 'white',
                    width: "140%",
                    height: "140%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px"
                }}>Fornecedores</div> </a>

            <a href="/caixa"
                style={{
                    textDecoration: "none",
                    textAlign: "center"
                }}>
                <div style={{
                    backgroundColor: 'white',
                    width: "140%",
                    height: "140%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px"
                }}>Caixa</div> </a>

            <a href="/local"
                style={{
                    textDecoration: "none",
                    textAlign: "center"
                }}>
                <div style={{
                    backgroundColor: 'white',
                    width: "140%",
                    height: "140%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px"
                }}>Local</div> </a>
        </div>

    )
}