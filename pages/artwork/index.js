import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Error from "next/error";
import { Row, Col } from "react-bootstrap";
import ArtworkCard from "@/components/ArtworkCard";
import Card from 'react-bootstrap/Card';
import { Pagination } from "react-bootstrap";

import validObjectIDList from '@/public/data/validObjectIDList.json'

const PER_PAGE=12;

export default function Artworks() {

    const [page, setPage] = useState(1);
    const [artworkList, setArtworkList] = useState(null);

    const router = useRouter();
    let finalQuery = router.asPath.split('?')[1];
    
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`);

    function previousPage(e) {
        if(page > 1){
          setPage(page - 1);
        }
    }
    
    function nextPage(e) {
        if(page < artworkList.length){
          setPage(page + 1);
        }
    }

    useEffect(() => {
        if(data){
            let results=[];
            let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));
            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
                const chunk = filteredResults.slice(i, i + PER_PAGE);
                results.push(chunk);
            }              
            setArtworkList(results);    
        }
        setPage(1); 
    }, [data]);

    if(error){
        return (
            <>
            <Error statusCode={404} />
            </>
        )
    }

    if(artworkList){
        return (
            <>
            <Row className="gy-4">
                {artworkList.length > 0  
                ?<>{artworkList[page-1].map((a) => (
                     <Col lg={3} key={a}><ArtworkCard objectID={a} /></Col>)
                    )}
                </> 
                : <Card><h4>Nothing Here</h4>Try searching for something else.</Card>}
                
            </Row>
            {artworkList.length > 0 && <Col><Row>
                <Pagination>
                    <Pagination.Prev onClick={previousPage}/>
                    <Pagination.Item>{page}</Pagination.Item>
                    <Pagination.Next onClick={nextPage}/>
                </Pagination>
            </Row></Col>}
            </>
        )
    }
    else{
        return null;
    }

}