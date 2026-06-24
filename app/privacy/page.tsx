import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"

export const metadata = {
  title: "Политика конфиденциальности | Добрые лапки",
  description: "Политика обработки персональных данных приюта «Добрые лапки»",
}

export default function PrivacyPage() {
  const date = "01 января 2024"

  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-8 lg:p-12">

            <h1 className="text-2xl lg:text-3xl font-bold text-stone-800 mb-2">
              Политика конфиденциальности
            </h1>
            <p className="text-sm text-stone-400 mb-8">Редакция от {date}</p>

            <div className="prose prose-stone max-w-none space-y-8 text-stone-600 leading-relaxed">

              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">1. Общие положения</h2>
                <p>
                  Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок
                  обработки персональных данных пользователей сайта{" "}
                  <span className="font-medium text-stone-700">dobryelapki.ru</span> (далее — «Сайт»)
                  Благотворительным приютом для животных «Добрые лапки» (далее — «Оператор»).
                </p>
                <p className="mt-3">
                  Политика разработана в соответствии с требованиями Федерального закона
                  от 27.07.2006 № 152-ФЗ «О персональных данных».
                </p>
                <p className="mt-3">
                  Используя Сайт, вы подтверждаете своё согласие с условиями настоящей Политики.
                  Если вы не согласны с Политикой, пожалуйста, прекратите использование Сайта.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">2. Какие данные мы собираем</h2>
                <p className="mb-3">Оператор собирает следующие персональные данные:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><span className="font-medium text-stone-700">При пожертвовании:</span> имя (опционально), сумма пожертвования, комментарий (опционально).</li>
                  <li><span className="font-medium text-stone-700">При заявке на усыновление:</span> имя, контактный телефон или email, сведения об условиях проживания.</li>
                  <li><span className="font-medium text-stone-700">При заявке на волонтёрство:</span> имя, контактный телефон или email, информация о себе.</li>
                  <li><span className="font-medium text-stone-700">Технические данные:</span> IP-адрес, данные браузера и устройства, файлы cookie.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">3. Цели обработки данных</h2>
                <p className="mb-3">Персональные данные используются исключительно для:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>обработки пожертвований и формирования отчётности;</li>
                  <li>рассмотрения заявок на усыновление и связи с заявителями;</li>
                  <li>координации волонтёрской деятельности;</li>
                  <li>улучшения работы Сайта;</li>
                  <li>соблюдения требований законодательства Российской Федерации.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">4. Правовые основания обработки</h2>
                <p>
                  Оператор обрабатывает персональные данные на следующих основаниях:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
                  <li>согласие субъекта персональных данных (ст. 6 ФЗ-152);</li>
                  <li>исполнение договора, стороной которого является субъект (договор пожертвования);</li>
                  <li>выполнение обязанностей, предусмотренных законодательством РФ.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">5. Хранение и защита данных</h2>
                <p>
                  Персональные данные хранятся на серверах, расположенных на территории
                  Российской Федерации, в базе данных Supabase с применением шифрования.
                </p>
                <p className="mt-3">
                  Оператор принимает необходимые технические и организационные меры для
                  защиты персональных данных от несанкционированного доступа, изменения,
                  раскрытия или уничтожения.
                </p>
                <p className="mt-3">
                  Данные хранятся в течение срока, необходимого для достижения целей обработки,
                  но не менее срока, предусмотренного законодательством РФ.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">6. Передача данных третьим лицам</h2>
                <p>
                  Оператор не передаёт персональные данные третьим лицам, за исключением:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
                  <li>платёжного оператора <span className="font-medium text-stone-700">Robokassa</span> — для проведения платежей (только технические данные транзакции);</li>
                  <li>случаев, предусмотренных законодательством Российской Федерации.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">7. Файлы cookie</h2>
                <p>
                  Сайт использует файлы cookie для обеспечения функциональности
                  (в том числе сохранения сессии авторизации). Файлы cookie не содержат
                  персональных данных и не передаются третьим лицам.
                </p>
                <p className="mt-3">
                  Вы можете отключить использование файлов cookie в настройках браузера,
                  однако это может повлиять на работу отдельных функций Сайта.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">8. Права субъекта данных</h2>
                <p className="mb-3">Вы имеете право:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>получить информацию об обработке своих персональных данных;</li>
                  <li>потребовать уточнения, блокирования или уничтожения данных;</li>
                  <li>отозвать согласие на обработку персональных данных;</li>
                  <li>обратиться с жалобой в Роскомнадзор.</li>
                </ul>
                <p className="mt-3">
                  Для реализации своих прав обратитесь по адресу:{" "}
                  <span className="font-medium text-stone-700">help@dobryelapki.ru</span>
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">9. Изменение политики</h2>
                <p>
                  Оператор вправе вносить изменения в настоящую Политику. Новая редакция
                  вступает в силу с момента её публикации на Сайте. Продолжение использования
                  Сайта после публикации изменений означает ваше согласие с новой редакцией.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">10. Контакты</h2>
                <p>
                  По вопросам обработки персональных данных обращайтесь:
                </p>
                <div className="rounded-xl bg-stone-50 border border-stone-100 p-5 mt-3">
                  <p className="text-sm text-stone-600">
                    Благотворительный приют «Добрые лапки»<br />
                    Email:{" "}
                    <a href="mailto:help@dobryelapki.ru" className="text-[#D4849A] hover:text-[#C4728A]">
                      help@dobryelapki.ru
                    </a>
                    <br />
                    Телефон: +7 (495) 123-45-67<br />
                    Адрес: ул. Животноводческая, 12, г. Санкт-Петербург, 196105
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
