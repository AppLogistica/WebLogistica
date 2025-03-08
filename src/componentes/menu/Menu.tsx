export function Menu() {

    return (
        <div className="menu" style={{ marginBottom: "2rem", backgroundColor: "#242424", display: "flex", justifyContent: "space-evenly", margin: "0 0 60px 0" }}>
            <a href="/main" style={{ textDecoration: "none", textAlign: "center" }}>
                <div
                    style={{
                        width: "200%",
                        height: "140%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "8px",
                        backgroundColor: '#ff6600',
                        color: 'white',
                        border: '2px solid #ffffff',
                    }}>
                    <b>INÍCIO</b>
                </div>
            </a>

            <a href="/email" style={{ textDecoration: "none", textAlign: "center" }}>
                <div
                    style={{
                        width: "200%",
                        height: "140%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "8px",
                        backgroundColor: '#ff6600', 
                        color: 'white',
                        border: '2px solid #FFFFFF',
                    }}>
                   <b>EMAIL</b>
                </div>
            </a>

            <a href="/fornecedores" style={{ textDecoration: "none", textAlign: "center" }}>
                <div
                    style={{
                        width: "140%",
                        height: "140%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "8px",
                        backgroundColor: '#ff6600',
                        color: 'white',
                        border: '2px solid #FFFFFF',
                    }}>
                    <b>FORNECEDRES</b>
                </div>
            </a>

            <a href="/caixa" style={{ textDecoration: "none", textAlign: "center" }}>
                <div
                    style={{
                        width: "200%",
                        height: "140%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "8px",
                        backgroundColor: '#ff6600',
                        color: 'white',
                        border: '2px solid #FFFFFF',
                    }}>
                    <b>CAIXA</b>
                </div>
            </a>
        </div>
    )
}
