import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"

export const metadata = {
  title: "Договор оферты | Добрые лапки",
  description: "Публичная оферта на заключение договора пожертвования",
}

export default function OfertaPage() {
  const date = "01 января 2024"

  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-8 lg:p-12">

            <h1 className="text-2xl lg:text-3xl font-bold text-stone-800 mb-2">
              Публичная оферта на заключение договора пожертвования
            </h1>
            <p className="text-sm text-stone-400 mb-8">Редакция от {date}</p>

            <div className="prose prose-stone max-w-none space-y-8 text-stone-600 leading-relaxed">

              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">1. Общие положения</h2>
                <p>
                  Настоящая публичная оферта (далее — «Оферта») адресована неограниченному кругу
                  физических лиц и является официальным предложением Благотворительного приюта
                  для животных «Добрые лапки» (далее — «Организация») заключить договор
                  пожертвования на условиях, изложенных ниже.
                </p>
                <p className="mt-3">
                  Деятельность Организации осуществляется в соответствии с Федеральным законом
                  от 11.08.1995 № 135-ФЗ «О благотворительной деятельности и добровольчестве
                  (волонтёрстве)».
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">2. Предмет договора</h2>
                <p>
                  Жертвователь безвозмездно передаёт денежные средства Организации на уставные
                  цели: содержание и лечение животных, находящихся в приюте, поиск для них
                  постоянных владельцев, а также развитие инфраструктуры приюта.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">3. Акцепт оферты</h2>
                <p>
                  Акцептом настоящей Оферты является совершение Жертвователем конклюдентных
                  действий — нажатие кнопки «Пожертвовать» на сайте{" "}
                  <span className="font-medium text-stone-700">dobryelapki.ru</span> после
                  проставления отметки о согласии с настоящей Офертой.
                </p>
                <p className="mt-3">
                  С момента акцепта Оферта считается заключённым договором пожертвования в
                  соответствии со статьями 572 и 582 Гражданского кодекса Российской Федерации.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">4. Порядок внесения пожертвования</h2>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Пожертвования принимаются в рублях Российской Федерации.</li>
                  <li>Минимальная сумма пожертвования — 1 (один) рубль.</li>
                  <li>Оплата производится через платёжную систему Robokassa с использованием банковских карт.</li>
                  <li>Пожертвование является добровольным и безвозмездным.</li>
                  <li>Организация не возвращает перечисленные средства, за исключением случаев технических ошибок при проведении платежа.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">5. Целевые пожертвования</h2>
                <p>
                  Жертвователь вправе указать целевое назначение пожертвования — конкретное
                  животное или направление помощи. Если целевое назначение не указано,
                  пожертвование направляется на общие нужды приюта по усмотрению Организации.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">6. Права и обязанности сторон</h2>
                <p className="font-medium text-stone-700 mb-2">Организация обязуется:</p>
                <ul className="list-disc list-inside space-y-2 ml-2 mb-4">
                  <li>использовать полученные средства исключительно на уставные цели;</li>
                  <li>вести учёт поступивших пожертвований;</li>
                  <li>публиковать отчёты об использовании средств на сайте.</li>
                </ul>
                <p className="font-medium text-stone-700 mb-2">Жертвователь вправе:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>запросить информацию об использовании пожертвования;</li>
                  <li>остаться анонимным при совершении пожертвования.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">7. Персональные данные</h2>
                <p>
                  Обработка персональных данных Жертвователя осуществляется в соответствии
                  с{" "}
                  <a href="/privacy" className="text-[#D4849A] underline underline-offset-2 hover:text-[#C4728A]">
                    Политикой конфиденциальности
                  </a>
                  , которая является неотъемлемой частью настоящей Оферты.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">8. Заключительные положения</h2>
                <p>
                  Организация вправе изменять условия настоящей Оферты в одностороннем порядке
                  путём публикации новой редакции на сайте. Изменения вступают в силу с момента
                  публикации.
                </p>
                <p className="mt-3">
                  По всем вопросам, связанным с пожертвованиями, обращайтесь:{" "}
                  <span className="font-medium text-stone-700">help@dobryelapki.ru</span>
                </p>
              </section>

              <div className="rounded-xl bg-stone-50 border border-stone-100 p-5 mt-6">
                <p className="text-sm text-stone-500">
                  <span className="font-semibold text-stone-700">Реквизиты Организации:</span><br />
                  Благотворительный приют для животных «Добрые лапки»<br />
                  ИНН: 0000000000 · КПП: 000000000<br />
                  Адрес: ул. Животноводческая, 12, г. Москва, 123456<br />
                  Email: help@dobryelapki.ru · Телефон: +7 (495) 123-45-67
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
