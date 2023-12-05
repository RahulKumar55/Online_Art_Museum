import useSWR from 'swr';
import Error from 'next/error';
import Card from 'react-bootstrap/Card';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

import { addToFavourites, removeFromFavourites } from '@/lib/userData';

export default function ArtworkCard(props) {

    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [showAdded, setShowAdded] = useState(false);
    const { data, error } = useSWR(props.objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}` : null);

    useEffect(()=>{
        setShowAdded(favouritesList?.includes(props.objectID))
    }, [favouritesList]);
    

    async function favouritesClicked(){
        if(showAdded){
            setFavouritesList(await removeFromFavourites(props.objectID));
            setShowAdded(false);
        }else{
            setFavouritesList(await addToFavourites(props.objectID))
            setShowAdded(true);
        }
    }

    if(error){
        return (
            <>
            <Error statusCode={404} />
            </>
          )
    }
    if(data){
        return (
            <>
              <Card>
                {data.primaryImage && <Card.Img variant="top" src= {data.primaryImage}/>}
                <Card.Body>
                    <Card.Title>{data.title ? data.title : 'N/A'}</Card.Title>
                    <Card.Text>
                        <strong>Date: </strong> {data.objectDate ? data.objectDate : 'N/A'}<br />
                        <strong>Classification: </strong> {data.classification ? data.classification : 'N/A'}<br />
                        <strong>Medium: </strong> {data.medium ? data.medium : 'N/A'}<br /><br />
                        <strong>Artist: </strong> {data.artistDisplayName ? <>{data.artistDisplayName}   (  <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer" >wiki</a>  ) </>: 'N/A'}<br />
                        <strong>Credit Line: </strong> {data.creditLine ? data.creditLine : 'N/A'}<br />
                        <strong>Dimensions: </strong> {data.dimensions ? data.dimensions : 'N/A'}<br />
                    </Card.Text>
                    <Button onClick={favouritesClicked} variant={showAdded ? "primary": "outline-primary"}>{showAdded ? "+ Favourite (Added)" : "+ Favourite"}</Button>
                    </Card.Body>
              </Card>
            </>
          )
    }
    else{
        return null
    }    
}
