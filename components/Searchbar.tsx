"use client"

import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, isValidElement, useState } from "react"

const isValidAmazonProductURL = (url: string) => {
    try {
        const parsedURL = new URL(url);
        const hostname = parsedURL.hostname;
        //check if the hostname contains amazon.com or amazon.
        if (hostname.includes('amazon.com')
            || hostname.includes('amazon.')
            || hostname.endsWith('amazon')) {
            return true;
        }
    } catch (error) {
        return false;
    }
    return false;
}

const Searchbar = () => {
    const [SearchPrompt, setSearchPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isValidLink = isValidAmazonProductURL(SearchPrompt);
        // alert(isValidLink ? 'valid link' : 'Invalid link')

        if (!isValidLink) return alert('Please provide a valid Amazon Link')
        try {
            setIsLoading(true);
            //scrape the product here
            const product = await scrapeAndStoreProduct(SearchPrompt);
        } catch (error) {
            console.log('error1 occured');
        } finally {
            setIsLoading(false);
        }
    }



    return (
        <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>
            <input type="text"
                value={SearchPrompt}
                onChange={(e) => setSearchPrompt(e.target.value)}

                placeholder="Enter Product Link" className="searchbar-input"
            />
            <button
                type="submit" className="searchbar-btn"
                disabled={SearchPrompt === ''}
            >{isLoading ? 'Searching... ' : 'Search'}</button>

        </form>
    )
}

export default Searchbar
