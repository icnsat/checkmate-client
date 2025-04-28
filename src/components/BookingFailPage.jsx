import { Container, Button } from 'react-bootstrap';

const BookingFailPage = () => {
    return (
        <Container className="my-5 text-center">
        {/* Иконка ошибки */}
        <div className="mb-4">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="72"
                height="72"
                fill="currentColor"
                className="bi bi-x-circle text-danger"
                viewBox="0 0 16 16"
            >
                <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
        </div>

        <h1 className="text-danger">Ваш аккаунт заблокирован</h1>

        <p className="mt-3 fs-5 text-secondary">
            К сожалению, вы не можете сделать бронирование, так как ваш аккаунт был заблокирован.
            Пожалуйста, свяжитесь с администрацией для решения этого вопроса.
        </p>

        <div className="mt-4">
            <Button variant="primary" size="lg" href="/" className="me-2">
                На главную
            </Button>
            <Button variant="outline-secondary" size="lg" href="mailto:support@example.com">
                Связаться с поддержкой
            </Button>
        </div>
        </Container>
    );
};

export default BookingFailPage;
