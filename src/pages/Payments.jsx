import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody } from '../components/Card';

const Payments = () => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="h1">Pagamenti</h1>
        <p className="muted">Traccia lo stato dei pagamenti, le divisioni e le scadenze</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="h3">Gestione Pagamenti</h3>
          <p className="muted">Questa pagina mostrerà tutti i pagamenti con opzioni di filtraggio e gestione</p>
        </CardHeader>
        <CardBody>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="h3 mb-2">Pagamenti in Arrivo</h3>
            <p className="muted">
              Questa pagina includerà il tracciamento dei pagamenti, la gestione delle divisioni e i promemoria delle scadenze.
            </p>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default Payments;
