import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody } from '../components/Card';

const CalendarPage = () => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="h1">Calendario</h1>
        <p className="muted">Vista mensile con scadenze di pagamento e pianificazione</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="h3">Calendario Pagamenti</h3>
          <p className="muted">Questa pagina mostrerà un calendario mensile con le scadenze di pagamento</p>
        </CardHeader>
        <CardBody>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="h3 mb-2">Calendario in Arrivo</h3>
            <p className="muted">
              Questa pagina includerà una vista calendario mensile con scadenze di pagamento e opzioni di pianificazione.
            </p>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default CalendarPage;
