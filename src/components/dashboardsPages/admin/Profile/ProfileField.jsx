export default function ProfileField({ label, value }) {
  return (
    <div className="mb-4">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-lg font-medium">{value}</p>
    </div>
  );
}
