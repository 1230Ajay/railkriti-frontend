
import { Metadata } from 'next';
import LocationPage from './location_page';


export const metadata:Metadata = {
  title: 'MAP | Railkriti',
  description: 'Default page description for SEO.',
}

export default function page({ params }: { params: { id: string } }) {

  return (
   <div>
        <LocationPage params={params.id}/>
   </div>
  );
}


