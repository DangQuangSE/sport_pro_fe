import PaymentResultClient from "@/components/checkout/PaymentResultClient";

type QueryValue = string | string[] | undefined;

const firstValue = (value: QueryValue) => Array.isArray(value) ? value[0] : value;

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, QueryValue>>;
}) {
  const query = await searchParams;

  return (
    <PaymentResultClient
      code={firstValue(query.code)}
      status={firstValue(query.status)}
      cancel={firstValue(query.cancel)}
      orderCode={firstValue(query.orderCode)}
    />
  );
}
