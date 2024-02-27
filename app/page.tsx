import HeroCarousel from "@/components/HeroCarousel"
import Searchbar from "@/components/Searchbar"
import Image from "next/image"
import { getAllProducts } from "@/lib/actions"
import ProductCard from "@/components/ProductCard"

const Home = async () => {

  const allProducts = await getAllProducts();


  return (
    <>
      <section className="px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center items-center">
            <p className="small-text">
              Smart Shopping Starts Here
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={20}
                height={20}
              />
            </p>
            <h1 className="head-text">
            Optimize with the Strength of 
              <span className="text-primary"> WebEase</span>
            </h1>
            <p className="mt-7">
            Empowering users with robust self-service analytics for enhanced conversion, engagement, and retention.
            </p>
            <Searchbar />
            {/* <SearchBar></SearchBar> */}

          </div>
          <HeroCarousel />
          {/* <HeroCarousel></HeroCarousel> */}
        </div>
      </section>

      <section className="trending-section">
        <h2 className="section-text">Trending</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-12">

          {allProducts?.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}

        </div>
      </section>

    </>
  )
}

export default Home
