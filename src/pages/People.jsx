import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody } from '../components/Card';

const People = () => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="h1">Persone</h1>
        <p className="muted">Gestisci i partecipanti e traccia i saldi individuali</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="h3">Gestione Persone</h3>
          <p className="muted">Questa pagina mostrerà tutte le persone con i loro saldi e la cronologia dei pagamenti</p>
        </CardHeader>
        <CardBody>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="h3 mb-2">Persone in Arrivo</h3>
            <p className="muted">
              Questa pagina includerà la gestione delle persone, il tracciamento dei saldi e la cronologia dei pagamenti.
            </p>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default People;
