import "../styles/dashboard.css";

export default function ConversionCard({ data = [] }) {

  return (
    <div className="card conversion-card ">
      <h6 className="conversion-title" style={{ fontSize: '18px', fontWeight: '800', color: '#1f2937', marginBottom: '24px' }}>
        Contact to Deal Conversion
      </h6>

      {data.map((d, i) => (
        <div key={i} className="conversion-row">
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '8px', display: 'block' }}>{d.label}</span>
          <div className="conversion-track" style={{ height: '5px', background: '#e2e8f0' }}>
            <div
              className="conversion-fill"
              style={{ width: d.w, backgroundColor: d.c, height: '100%', borderRadius: '999px' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
