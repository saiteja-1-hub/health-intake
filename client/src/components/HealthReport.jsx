function HealthReport({ report }) {
  return (
    <div className="health-report">
      <h2>Medical Intake Report</h2>

      {!report ? (
        <p>
          Complete the health intake to generate
          your report.
        </p>
      ) : (
        <div className="report-content">
          <div>
            <strong>Patient Name:</strong>{" "}
            {report.patientName}
          </div>

          <div>
            <strong>Age:</strong>{" "}
            {report.age}
          </div>

          <div>
            <strong>Symptoms:</strong>{" "}
            {report.symptoms}
          </div>

          <div>
            <strong>Symptoms Started:</strong>{" "}
            {report.symptomStart}
          </div>

          <div>
            <strong>Severity:</strong>{" "}
            {report.severity}/10
          </div>

          <div>
            <strong>Existing Medical Conditions:</strong>{" "}
            {report.medicalConditions}
          </div>

          <div>
            <strong>Current Medications:</strong>{" "}
            {report.medications}
          </div>

          <div>
            <strong>Recommendation:</strong>{" "}
            {report.recommendation}
          </div>
        </div>
      )}
    </div>
  );
}

export default HealthReport;