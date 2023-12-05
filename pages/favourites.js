import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { Row, Col } from "react-bootstrap";
import ArtworkCard from "@/components/ArtworkCard";
import Card from 'react-bootstrap/Card';

export default function Favourites() {
    
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

    if(!favouritesList) return null;

    return (
        <>
        <Row className="gy-4">
            {favouritesList.length > 0  
            ?<>{favouritesList.map((a) => (
                 <Col lg={3} key={a}><ArtworkCard objectID={a} /></Col>)
                )}
            </> 
            : <Card><h4>Nothing Here</h4>Try searching for something else.</Card>}    
        </Row>
        </>
    )
}