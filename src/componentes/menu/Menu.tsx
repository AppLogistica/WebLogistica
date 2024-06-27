export function Menu() {

    return (
        <div className="menu" style={{ marginBottom: "2rem", backgroundColor: "#242424", display: "flex", justifyContent: "space-evenly", margin: "0 0 60px 0"}}>
            <a href="/main"
                style={{
                    textDecoration: "none",
                    textAlign: "center"
                }}>
                <div
                    style={{
                        width: "200%",
                        height: "140%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "8px",
                        backgroundColor: '#808080', 
                        color: 'white',  
                        border: '2px solid #FFFFFF',
                    }}>Inicio</div></a>

            <a href="/email"
                style={{
                    textDecoration: "none",
                    textAlign: "center"
                }}>
                <div
                    style={{
                        backgroundColor: 'white',
                        width: "200%",
                        height: "140%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "8px",
                        backgroundColor: '#808080', 
                        color: 'white',  
                        border: '2px solid #FFFFFF',
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
                    borderRadius: "8px",
                    backgroundColor: '#808080', 
                    color: 'white',  
                    border: '2px solid #FFFFFF',
                }}>Fornecedores</div> </a>

            <a href="/caixa"
                style={{
                    textDecoration: "none",
                    textAlign: "center"
                }}>
                <div style={{
                    backgroundColor: 'white',
                    width: "200%",
                    height: "140%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px",
                    backgroundColor: '#808080', 
                    color: 'white',  
                    border: '2px solid #FFFFFF',
                }}>Caixa</div> </a>

        </div>

    )
}

/*
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
}}>Local</div> </a>*/