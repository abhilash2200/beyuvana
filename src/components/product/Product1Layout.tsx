import { Product } from "@/app/data/fallbackProducts";
import ProductImg from "./ProductImg";
import ProductDetails from "./ProductDetails";
import SelectPack from "./SelectPack";

export default function Product1Layout({ product }: { product: Product }) {
    return (
        <div className="container mx-auto px-4 py-10">
            <div className="flex flex-wrap justify-between gap-x-2">
                <div className="w-full md:w-[30%]">
                    <ProductImg images={product.images} />
                </div>
                <div className="w-full md:w-[30%]">
                    <ProductDetails name={product.name} tagline={product.tagline} description={product.description} certificateImg={product.certificateImg} faq={product.faq} productId={product.id} />
                </div>
                <div className="w-full md:w-[30%]">
                    <SelectPack />
                </div>
            </div>
            <hr className="my-10" />
            {/* <div>
                <div className="flex flex-wrap justify-between items-center">
                    <div className="w-full md:w-[23%]">
                        <div className="flex flex-col items-center justify-center">
                            <Image src="/assets/img/product-details/certificate.png" alt="certificate" width={40} height={40} />
                            <p className="text-sm text-gray-500">View Lab Certificates</p>
                        </div>
                    </div>
                    <div className="w-full md:w-[23%]">
                        <div className="flex flex-col items-center justify-center">
                            <Image src="/assets/img/product-details/certificate.png" alt="certificate" width={40} height={40} />
                            <p className="text-sm text-gray-500">View Lab Certificates</p>
                        </div>
                    </div>
                    <div className="w-full md:w-[23%]">
                        <div className="flex flex-col items-center justify-center">
                            <Image src="/assets/img/product-details/certificate.png" alt="certificate" width={40} height={40} />
                            <p className="text-sm text-gray-500">View Lab Certificates</p>
                        </div>
                    </div>
                    <div className="w-full md:w-[23%]">
                        <div className="flex flex-col items-center justify-center">
                            <Image src="/assets/img/product-details/certificate.png" alt="certificate" width={40} height={40} />
                            <p className="text-sm text-gray-500">View Lab Certificates</p>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
}