import { Result, Button, notification } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { SmileOutlined, CloseCircleOutlined, WarningOutlined, SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import RouteNames from '../../../constants/routeNames';

const buttonStyle = { borderRadius: '10px', fontSize: '16px', padding: '10px 20px' };
const containerStyle = { backgroundColor: '#f6f1f8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' };

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        if (orderId) {
            sessionStorage.removeItem("cartItems");
            notification.success({ message: "Thanh toán thành công! Giỏ hàng đã được làm trống." });
        }
    }, [orderId]);

    return (
        <div style={containerStyle}>
            <Result
                icon={<SmileOutlined style={{ color: '#52c41a', fontSize: '48px' }} />}
                status="success"
                title="Thanh toán thành công!"
                subTitle={`Mã đơn hàng: ${orderId || 'Không xác định'}`}
                extra={[
                    <Button type="primary" onClick={() => navigate('/')} style={buttonStyle}>
                        💖 Về Trang Chủ
                    </Button>
                ]}
            />
        </div>
    );
};

const PaymentFailed = () => {
    const navigate = useNavigate();

    return (
        <div style={containerStyle}>
            <Result
                icon={<CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '48px' }} />}
                status="error"
                title="Thanh toán thất bại!"
                subTitle="Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau."
                extra={[
                    <Button type="primary" onClick={() => navigate('/')} style={buttonStyle}>🔄 Thử Lại</Button>
                ]}
            />
        </div>
    );
};

const PaymentError = () => {
    const navigate = useNavigate();

    return (
        <div style={containerStyle}>
            <Result
                icon={<WarningOutlined style={{ color: '#faad14', fontSize: '48px' }} />}
                status="warning"
                title="Lỗi thanh toán"
                subTitle="Có lỗi không mong muốn xảy ra. Vui lòng liên hệ hỗ trợ."
                extra={[
                    <Button type="primary" onClick={() => navigate('/')} style={buttonStyle}>📞 Liên Hệ Hỗ Trợ</Button>
                ]}
            />
        </div>
    );
};

const PaymentNotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={containerStyle}>
            <Result
                icon={<SearchOutlined style={{ color: '#1890ff', fontSize: '48px' }} />}
                status="404"
                title="Không tìm thấy đơn hàng"
                subTitle="Chúng tôi không tìm thấy đơn hàng này. Vui lòng kiểm tra lại."
                extra={[
                    <Button type="primary" onClick={() => navigate('/')} style={buttonStyle}>🏠 Về Trang Chủ</Button>
                ]}
            />
        </div>
    );
};

const VnPayReturn = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const responseCode = searchParams.get('vnp_ResponseCode');
        const orderId = searchParams.get('vnp_TxnRef');

        setTimeout(() => {
            if (responseCode === '00') {
                navigate(`${RouteNames.PAYMENT_SUCCESS}?orderId=${orderId}`);
            } else {
                navigate(RouteNames.PAYMENT_FAILED);
            }
        }, 2000);
    }, [navigate, searchParams]);

    return (
        <div style={containerStyle}>
            <Result
                icon={<LoadingOutlined style={{ color: '#1890ff', fontSize: '48px' }} spin />}
                title="Đang xử lý thanh toán..."
                subTitle="Vui lòng chờ giây lát."
            />
        </div>
    );
};

export { PaymentSuccess, PaymentFailed, PaymentError, PaymentNotFound, VnPayReturn };
