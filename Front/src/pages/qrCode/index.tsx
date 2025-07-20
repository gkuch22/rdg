import Qr from "@/assets/67104b7d-2de2-4147-8cd5-f15ae5480e60.svg";

const QRcode = () => {
  return (
    <div className="flex min-h-screen justify-center items-center">
        <div className="flex items-center gap-10 flex-col">
        <img src={Qr} alt="QR code" className="w-sm h-full object-contain" />
      </div>
    </div>
  );
};

export default QRcode;
