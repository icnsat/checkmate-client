import { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import api from '../api/api';

const DiscountModal = ({ show, handleClose }) => {
    const [loading, setLoading] = useState(true);
    const [discountText, setDiscountText] = useState('');

    const fetchDiscount = async () => {
        setLoading(true);
        setDiscountText('');

        try {
            // Имитация загрузки несколько секунд
            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = await api.get('/discounts/roulette/');
            setDiscountText(
                'Получена скидка ' + response.data.discount_amount + '%!\n' +
                'Действует до ' + new Date(response.data.expires_at).toLocaleString()
            );
        } catch (error) {
            console.error(error);
            setDiscountText(error.response.data.detail);
        } finally {
            setLoading(false);
        }
    };

    // Когда окно открывается — сразу запрашиваем данные
    const handleShow = () => {
        fetchDiscount();
    };

    return (
        <Modal show={show} onHide={handleClose} onShow={handleShow} centered>
            <Modal.Header closeButton>
                <Modal.Title>Персональная скидка</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                {loading ? (
                <>
                    <Spinner animation="border" role="status" variant="warning"/>
                    <p className="mt-3">Генерируем персональную скидку...</p>
                </>
                ) : (
                    discountText && discountText.split('\n').map((line, index) => (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                          {line}
                        </motion.p>
                    ))
                )}
            </Modal.Body>
            {/* <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Закрыть
                </Button>
            </Modal.Footer> */}
        </Modal>
    );
};

export default DiscountModal;
