// Estructura compartida de Login y Registro: panel verde a la izquierda, formulario a la derecha.
export default function AuthLayout({ eyebrow, titular, intro, puntos, etiqueta, titulo, subtitulo, children, pie }) {
  return (
    <main className="auth-page">
      <section className="auth-container">
        <div className="auth-info">
          <span className="logo">CampoDirecto<span>.</span></span>

          <div className="info-content">
            <span className="eyebrow-dark">{eyebrow}</span>
            <h1>{titular}</h1>
            <p>{intro}</p>

            <div className="info-points">
              {puntos.map((punto) => (
                <div className="info-point" key={punto.numero}>
                  <span className="point-number">{punto.numero}</span>
                  <div>
                    <strong>{punto.titulo}</strong>
                    <p>{punto.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="location">ATLÁNTICO · COLOMBIA</p>
        </div>

        <div className="auth-card">
          <span className="card-label">{etiqueta}</span>
          <h2>{titulo}</h2>
          <p className="card-sub">{subtitulo}</p>
          {children}
          <div className="auth-pie">{pie}</div>
        </div>
      </section>
    </main>
  );
}
