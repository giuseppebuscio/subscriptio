import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody } from '../components/Card';

const Accounting = () => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="h1">Contabilità e Report</h1>
        <p className="muted">Analisi finanziaria, previsioni e report dettagliati</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="h3">Report Finanziari</h3>
          <p className="muted">Questa pagina mostrerà analisi finanziarie complete e reportistica</p>
        </CardHeader>
        <CardBody>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="h3 mb-2">Contabilità in Arrivo</h3>
            <p className="muted">
              Questa pagina includerà report finanziari, ripartizioni per categoria e strumenti di previsione.
            </p>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default Accounting;
