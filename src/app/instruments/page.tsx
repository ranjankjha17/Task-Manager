import { supabase } from "@/utils/supabase/client";

interface Instrument {
  id: number;
  name: string; 
}

const InstrumentPage = async () => {
  const { data, error } = await supabase
    .from<Instrument>('instruments') 
    .select('*');

  if (error) {
    console.error(error);
    return <div>Error fetching instruments</div>;
  }

  return (
    <div>
      <h1>Instruments from Supabase</h1>
      <ul>
        {data?.map((instrument) => (
          <li key={instrument.id}>{instrument.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default InstrumentPage;