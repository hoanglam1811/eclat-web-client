import { Button, Card, Typography } from 'antd';

export default function EmailVerify({email}: {email: string}) {
  return (
      <Card className="shadow-lg rounded-2xl p-6 text-center max-w-md mb-[15px]">
        <Typography.Title level={3} className="text-gray-800">
          Liên kết xác thực đã được gửi!
        </Typography.Title>
        <Typography.Text className="text-gray-600 mt-2 block text-left">
          Vui lòng kiểm tra hộp thư của email <b className="font-bold">{email}</b> và nhấp vào liên kết xác thực để hoàn tất quá trình đăng ký.
        </Typography.Text>
        <Typography.Text type="secondary" className="text-sm mt-2 block text-left">
          Nếu bạn không nhận được email, hãy kiểm tra thư mục spam hoặc thử gửi lại.
        </Typography.Text>
        {/* <Button type="primary" className="mt-4 bg-blue-600 hover:bg-blue-700"> */}
        {/*   Gửi lại email */}
        {/* </Button> */}
      </Card>
  );
}
