import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center font-arabic">عن الشركة</h1>
        
        <div className="mb-12 relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src="/images/about.jpeg"
            alt="سكاربا للأحذية"
            fill
            className="object-contain"
          />
        </div>

        <div className="space-y-8">
          <section className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 font-arabic">من نحن</h2>
            <p className="text-secondary-600 leading-relaxed font-arabic">
              سكاربا هي علامة تجارية رائدة في مجال الأحذية، نقدم مجموعة متنوعة من الأحذية الرياضية والكلاسيكية عالية الجودة. 
              نحن نؤمن بأن الحذاء المناسب يمكن أن يغير يومك بأكمله، ولهذا نحرص على تقديم أفضل المنتجات بأسعار منافسة.
            </p>
          </section>

          <section className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 font-arabic">رؤيتنا</h2>
            <p className="text-secondary-600 leading-relaxed font-arabic">
              نسعى لأن نكون الوجهة الأولى للأحذية في المملكة العربية السعودية، من خلال تقديم منتجات عالية الجودة 
              وخدمة عملاء متميزة وتجربة تسوق سلسة.
            </p>
          </section>

          <section className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 font-arabic">قيمنا</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 font-arabic">الجودة</h3>
                <p className="text-secondary-600 font-arabic">نقدم أفضل المنتجات من حيث الجودة والمتانة</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 font-arabic">الابتكار</h3>
                <p className="text-secondary-600 font-arabic">نواكب أحدث صيحات الموضة والتصاميم العصرية</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 font-arabic">رضا العملاء</h3>
                <p className="text-secondary-600 font-arabic">نضع رضا عملائنا في مقدمة أولوياتنا</p>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 font-arabic">لماذا تختار سكاربا؟</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-primary-600 ml-2">✓</span>
                <p className="text-secondary-600 font-arabic">منتجات عالية الجودة من أفضل العلامات التجارية</p>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 ml-2">✓</span>
                <p className="text-secondary-600 font-arabic">أسعار منافسة وعروض مستمرة</p>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 ml-2">✓</span>
                <p className="text-secondary-600 font-arabic">خدمة عملاء متميزة على مدار الساعة</p>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 ml-2">✓</span>
                <p className="text-secondary-600 font-arabic">شحن سريع لجميع مناطق المملكة</p>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
} 