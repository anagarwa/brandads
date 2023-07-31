/* 
* <license header>
*/

import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components';
import {connect, PublishAndNotify, quickpublish} from './sharepoint.js';

import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 90vh;
  justify-content: flex-end;
  padding: 10px;
  overflow: hidden;
  border: 2px solid #ccc;
  border-radius: 8px;
`;

const ImageAndTextContainer = styled.div`
  background-color: #f9f9f9;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-left: 10px;
  overflow-y: auto;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
`;

const VerticalWrapper = styled.div`
  width: 80%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  flex: 1;
`;

const MessageArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
  border: 2px solid #ccc;
  border-radius: 8px;
`;

const MessageBubble = styled.div`
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 8px;
  margin: 5px;
  max-width: 100%;
  align-self: ${({ sender }) => (sender === 'You' ? 'flex-start' : 'flex-end')};
  ${({ sender }) =>
    sender === 'You'
        ? `
          background-color: #dcf8c6;
          align-self: flex-start;
        `
        : `
          background-color: #f0f0f0;
          align-self: flex-end;
        `}
  border: 2px solid #ccc;
  border-radius: 8px;
`;

const SenderLabel = styled.span`
  font-weight: bold;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const MessageInput = styled.input`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  flex: 1;
  margin: 5px;
`;

const SendButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
`;

const Heading = styled.h1`
  font-size: 40px;
  font-weight: bold;
  margin: 20px;
  text-align: center;
`;

const ImageButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin-top: auto;
  cursor: pointer;
  margin-bottom: 10px;
`;

const Image = styled.img`
  width: 100%;
  max-width: 100%;
  object-fit: cover;
  margin: 10px;
`;

const ImageContainer = styled.div`
  width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ImageText = styled.p`
  margin-top: 5px;
`;

const UrlContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const UrlText = styled.a`
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
  margin: 5px;
`;


function App (props) {
    console.log('runtime object:', props.runtime)
    console.log('ims object:', props.ims)

    // use exc runtime event handlers
    // respond to configuration change events (e.g. user switches org)
    props.runtime.on('configuration', ({ imsOrg, imsToken, locale }) => {
        console.log('configuration change', { imsOrg, imsToken, locale })
    })
    // respond to history change events
    props.runtime.on('history', ({ type, path }) => {
        console.log('history change', { type, path })
    })

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const messageAreaRef = useRef(null);
    const [dynamicComponents, setDynamicComponents] = useState([]);
    const lastDynamicComponentRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const image1 = 'https://raw.githubusercontent.com/anagarwa/adobe-screens-brandads/main/content/screens/ads/gw/ad1/p1.png';
    const image2 = 'https://raw.githubusercontent.com/anagarwa/adobe-screens-brandads/main/content/screens/ads/gw/ad1/p2.png';
    const image3 = 'https://raw.githubusercontent.com/anagarwa/adobe-screens-brandads/main/content/screens/ads/gw/ad1/p3.png';

    const url1 = 'https://www.adidas.co.in/copa-pure.3-firm-ground-boots/HQ8941.html';
    const url2 = 'https://www.adidas.co.in/x-crazyfast.1-fg/HQ4516.html';
    const url3 = 'https://www.adidas.co.in/valentines-day-ultraboost-1.0-shoes/HQ3857.html';

    const imageUrl1 = 'https://raw.githubusercontent.com/anagarwa/adobe-screens-brandads/main/content/screens/ads/gw/ad1/1.png';
    const imageUrl2 = 'https://raw.githubusercontent.com/anagarwa/adobe-screens-brandads/main/content/screens/ads/gw/ad1/2.png';
    const imageUrl3 = 'https://raw.githubusercontent.com/anagarwa/adobe-screens-brandads/main/content/screens/ads/gw/ad1/3.png';

    const imageUrl4 = 'https://raw.githubusercontent.com/anagarwa/adobe-screens-brandads/main/content/screens/ads/gw/ad1/redoutput.png';
    const imageUrl5 = 'https://raw.githubusercontent.com/anagarwa/adobe-screens-brandads/main/content/screens/ads/gw/ad1/redoutput2.png';
    const imageUrl6 = 'https://raw.githubusercontent.com/anagarwa/adobe-screens-brandads/main/content/screens/ads/gw/ad1/redoutput3.png';

    const imageUrl7 = 'https://raw.githubusercontent.com/anagarwa/adobe-screens-brandads/main/content/screens/ads/gw/ad1/blueoutput.png';
    const imageUrl8 = 'https://raw.githubusercontent.com/anagarwa/adobe-screens-brandads/main/content/screens/ads/gw/ad1/blueoutput2.png';
    const imageUrl9 = 'https://raw.githubusercontent.com/anagarwa/adobe-screens-brandads/main/content/screens/ads/gw/ad1/blueoutput3.png';

    const text1 = 'Engineered for Comfort';
    const text2 = 'X CRAZYFAST.1 FG';
    const text3 = 'Layered Mesh Support';
    const text4 = 'Engineered for Stability';

    const jsonRef = useRef({
        imageAndUrls: { type: 'imageAndUrl', data: [{ image: image1, text: url1 }, { image: image2, text: url2 }, { image: image3, text: url3 }] },
        imageAndTexts: { type: 'imageAndText', data: [{ image: imageUrl1, text: text1 }, { image: imageUrl2, text: text2 }, { image: imageUrl3, text: text3 }] },
        modifiedText: { type: 'modifiedText', data: [{ image: imageUrl1, text: text4 }, { image: imageUrl2, text: text2 }, { image: imageUrl3, text: text3 }] },
        experienceImages: { type: 'experienceImage', data: [{ image: imageUrl4, text: '' }, { image: imageUrl5, text: '' }, { image: imageUrl6, text: '' }] },
        campaignImages: { type: 'campaignImage', data: [{ image: imageUrl7, text: '' }, { image: imageUrl8, text: '' }, { image: imageUrl9, text: '' }] },
        uploadImages: { type: 'uploadImage', data: [{ image: imageUrl7, text: '' }, { image: imageUrl8, text: '' }, { image: imageUrl9, text: '' }] },
    });
    const getPromptResponse = (prompt) => {

        if(prompt.includes('football')) {
            return jsonRef.current.imageAndUrls;
        }
        if(prompt.includes('page')) {
            return jsonRef.current.imageAndTexts;
        }
        if(prompt.includes('text')) {
            return jsonRef.current.modifiedText;
        }
        if(prompt.includes('experiences')) {
            return jsonRef.current.experienceImages;
        }
        if(prompt.includes('color')) {
            return jsonRef.current.campaignImages;
        }
        if(prompt.includes('campaign')) {
            return jsonRef.current.uploadImages;
        }
    };

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleSendMessage = async () => {
        const inputStr = inputText.trim();
        if (inputStr !== '') {
            const newMessage = {text: inputText, sender: 'You'};
            setMessages([...messages, newMessage]);
            setInputText('');

            setTimeout(() => {
                const botReply = {
                    text: "I'm a bot. I received your message.",
                    sender: 'Bot',
                };
                setMessages((prevMessages) => [...prevMessages, botReply]);
            }, 500);

            setTimeout(() => {
                promptHandle(inputStr);
            }, 2000);
        }
    };

    const promptHandle = async (inputStr) => {
        const response = getPromptResponse(inputStr);
        const type = response && response.type;
        if (type) {
            switch (type) {
                case 'imageAndUrl' :
                    addImageAndUrlComponent(jsonRef.current.imageAndUrls.data);
                    break;
                case 'imageAndText' :
                    addImageAndTextComponent(jsonRef.current.imageAndTexts.data);
                    break;
                case 'modifiedText' :
                    addImageAndTextComponent(jsonRef.current.modifiedText.data);
                    break;
                case 'experienceImage' :
                    addImageAndTextComponent(jsonRef.current.experienceImages.data);
                    break;
                case 'campaignImage' :
                    addImageAndTextComponent(jsonRef.current.campaignImages.data);
                    break;
                case 'uploadImage' :
                    const image = jsonRef.current.uploadImages.data;
                    uploadImage(image);
                    break;
                default:
            }
        }
    }

    const uploadImage = (images) => {
        const fetchData = async () => {
            try {
                await connect(async () => {
                    try {
                        const response  = await PublishAndNotify(images);
                        console.log(response);
                        // setData(response);
                    } catch (e) {
                        console.error(e);
                    }
                });
            } catch (error) {
                console.error('Error in async function:', error);
            }
        };

        fetchData();

    }

    const addImageAndTextComponent = (imageAndTexts) => {
        setDynamicComponents((prev) => [
            ...prev,
            <ImageAndTextContainer key={prev.length} ref={lastDynamicComponentRef}>
                {imageAndTexts.map(({ image, text }, index) => (
                    <ImageContainer key={index} image={image}>
                        <Image src={image} alt="Image" />
                        <ImageText>{text}</ImageText>
                    </ImageContainer>
                ))}
            </ImageAndTextContainer>,
        ]);
    };

    const addImageAndUrlComponent = (imageAndTexts) => {
        setDynamicComponents((prev) => [
            ...prev,
            <>
                <ImageAndTextContainer key={prev.length} ref={lastDynamicComponentRef}>
                    {imageAndTexts.map(({ image, text }, index) => (
                        <ImageContainer key={index} image={image}>
                            <Image src={image} alt="Image" />
                            <UrlText key={index} href={text} target="_blank">
                                {text}
                            </UrlText>
                        </ImageContainer>
                    ))}
                </ImageAndTextContainer>,
            </>,
        ]);
    };
    const addUrlComponent = (urls) => {
        setLoading(true);
        setDynamicComponents((prev) => [
            ...prev,
            <UrlContainer key={prev.length} ref={lastDynamicComponentRef}>
                {urls.map((url, index) => (
                    <UrlText key={index} href={url} target="_blank">
                        {url}
                    </UrlText>
                ))}
            </UrlContainer>,
        ]);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    const addTextOnImages = async () => {
        const arr = [];
        for (const info of jsonRef.current.imageUrls.data) {
            const imageData = await handleImageDownload(info.image);
            const modifiedImageData = await handleUpload(imageData, info.text);
            const image = modifiedImageData[0];
            const imageInfo = coordinates(modifiedImageData[1]);
            arr.push({image, imageInfo});
        }
        return arr;
    };

    //{ xl: 944, yl: 56, xr: 1017, yr: 818, fsz: 60, fontstr: 'Lace UpEnchane Game' }
    const coordinates =  (inputString) => {
        const objectArrayString = inputString.match(/\[.*\]/g)[0];
        const validJsonString = objectArrayString.replace(/'/g, '"');
        const objectArray = JSON.parse(validJsonString);
        const position = objectArray[1];
        const loc = [position.yl,position.xl];
        const text = position.fontstr;
        const size = [position.yr-position.yl,position.xr-position.xl];
        const imgCoordinates = {loc, text, size};
        return imgCoordinates;
    }

    const handleImageDownload = async (imageUrl) => {
        const blob = await fetchUrl(imageUrl);
        const dataUrl = await convertBlobToDataURL(blob);
        console.log('handleImageDownload dataUrl:', dataUrl);
        return dataUrl;
    };

    const fetchUrl = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch image");
            }

            return await response.blob();
        } catch (error) {
            console.error("handleImageDownload Error fetching image:", error);
        }
    };

    const updateImageAndText = async (prompt) => {
        const params = {};
        const imageUrls = jsonRef.current.imageUrls.data;

        const imageNum = await getIndex(prompt);
        const data = jsonRef.current.modifiedImages.data[imageNum];
        const imageData = data.imageInfo;
        const image = imageUrls[imageNum].image;
        const text = imageUrls[imageNum].text;
        const locHPos = await horizontalPos(prompt);
        const locVPos = await verticalPos(prompt);
        const theme = await getTheme(prompt);
        const changeInSize = await changeSize(prompt);
        const newLoc = [imageData.loc[0]+locHPos, imageData.loc[1]+locVPos];
        const newSize = [imageData.size[0]+changeInSize, imageData.size[1]+changeInSize];

        params.prompt = theme;
        params.loc = newLoc.join(',');
        params.size = newSize.join(',');
        params.text = text;
        params.img = image;
        jsonRef.current.modifiedImages.data[imageNum].imageInfo = {loc:newLoc, size:newSize, text:text}

        const queryParams = new URLSearchParams(params);
        const url = `http://127.0.0.1:8000/is/image/base-image.jpeg?${queryParams}`;
        const blob = await fetchUrl(url);
        const dataUrl = await convertBlobToDataURL(blob);
        jsonRef.current.modifiedImages.data[imageNum].image = dataUrl;
        console.log('updateImageAndText blob', blob);
        console.log('updateImageAndText dataUrl', dataUrl);
    }

    const getTheme = async (str) => {
        const regexPattern = /to\s+(.*?)\s*(?:and|,|$)/;
        const theme = str.match(regexPattern);
        return theme;
    }

    const getIndex = async (array) => {
        if(array.includes('second')){
            return 1;
        }
        if(array.includes('third')){
            return 2;
        }
        return 0;
    }

    const horizontalPos = async(array) => {
        if(array.includes('right')){
            return 20;
        }
        if(array.includes('left')){
            return -20;
        }
        return 0;
    }

    const verticalPos = async(array) => {
        if(array.includes('down')){
            return 20;
        }
        if(array.includes('up')){
            return 20;
        }
        return 0;
    }

    const changeSize = async(array) => {
        if(array.includes('increase')){
            return 10;
        }
        if(array.includes('decrease')){
            return -10;
        }
        return 0;
    }

    const convertBlobToDataURL = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const handleUpload = async (imageData, text) => {
        try {
            if (!imageData) {
                console.error("handleUpload No image selected.");
                return;
            }
            const headers = {
                'Accept': '*/*',
                'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                'Pragma': 'no-cache',
            };

            const arr = [imageData, text];
            const payload = {
                fn_index: 0,
                data: arr,
                event_data: null,
                session_hash: '8zg3bb7uz3h',
            };

            const response = await axios.post('http://mdsr-panther:7910/run/predict', payload, { headers });

            const data = response.data.data;
            console.log('handleUpload response data', data[0]);
            return data;
        } catch (error) {
            console.error("handleUpload Error uploading image:", error);
        }
    };

    useEffect(() => {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        }
        if (lastDynamicComponentRef.current) {
            lastDynamicComponentRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        if (loading) {
            const loadingTimer = setTimeout(() => {
                setLoading(false);
            }, 1000);
            return () => clearTimeout(loadingTimer);
        }
    }, [loading, messages, dynamicComponents]);

    return (
        <div style={{ overflowX: 'hidden' }}>
            <Heading>Smart Brands Campaign Ads</Heading>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Container>
                    <MessageArea ref={messageAreaRef}>
                        {messages.map((message, index) => (
                            <MessageBubble key={index} sender={message.sender}>
                                <SenderLabel>{message.sender}: </SenderLabel>
                                {message.text}
                            </MessageBubble>
                        ))}
                    </MessageArea>
                    <InputContainer>
                        <MessageInput
                            type="text"
                            value={inputText}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                        />
                        <SendButton onClick={handleSendMessage}>Send</SendButton>
                    </InputContainer>
                </Container>
                <VerticalWrapper>
                    {dynamicComponents}
                </VerticalWrapper>
            </div>
        </div>
    );

    // Methods

    // error handler on UI rendering failure
    function onError (e, componentStack) { }

    // component to show if UI fails rendering
    function fallbackComponent ({ componentStack, error }) {
        return (
            <React.Fragment>
                <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
                    Something went wrong :(
                </h1>
                <pre>{componentStack + '\n' + error.message}</pre>
            </React.Fragment>
        )
    }
}

export default App
