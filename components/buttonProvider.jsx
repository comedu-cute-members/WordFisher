import { Button, Link, Spacer } from "@nextui-org/react";
import { useEffect, useState } from "react";

// props은 home일 때 영상 업로드의 여부를, search땐 검색 단어 입력 여부를 받음
export default function ButtonProvider(props){

    const [backIsDisabled, setBackIsDisabled] = useState(true);
    const [searchIsDisabled, setSearchIsDisabled] = useState(true);
    const [nextLink, setNextLink] = useState("");
    const [backLink, setBackLink] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() =>{
        if(props.link == "home"){
            setNextLink("/search");
            if(props.isDisabled == false){
                setSearchIsDisabled(false);
                console.log("search is true"); 
            }
        }
        if(props.link == "search"){
            setNextLink("/result");
            setBackLink("../");
            setBackIsDisabled(false);
            if(props.isDisabled == false){
                setSearchIsDisabled(false);
            }
            else{
                setSearchIsDisabled(true);
            }
        }
    })

    const onDrop= async (files)=>{
        let formData = new FormData();

        formData.append("files",files[0])
        
        axios({
            data: formData,
            headers:{'Content-Type': 'multipart/form-data'},
        })
        // 통신 성공했을 때
        .then(response=>{
            console.log(response.data);
        })
        // 오류발생시
        .catch(error=>{
            console.error(error);
        });
    };
        
    const clickHandler = ({ item }) =>{
        //navigate('/search', {state: {item},});
    
        setIsLoading(true);
        //onDrop(file);
    
        setTimeout(()=>{
          setIsLoading(false);
        }, 30000);
      };

    return (
        <div className="flex flex-row my-auto justify-center border-4">
            <Button 
            onClick={clickHandler}
            isLoading={isLoading}
            className="text-black/50 bg-blue-100 max-w-30 shadow-lg dark:bg-blue-500 dark:text-white" as={Link} href={backLink}
            isDisabled={backIsDisabled}>
                Back
            </Button>
            
            <Spacer x={300}/>
            
            <Button 
            onClick={clickHandler}
            isLoading={isLoading}
            className="text-black/50 bg-blue-100 max-w-30 shadow-lg dark:bg-blue-500 dark:text-white" as={Link} href={nextLink}
            //onClick={onDrop()}
            isDisabled={searchIsDisabled}
            >
                Search!
            </Button>
        </div>
    );
}