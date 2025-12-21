"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "Apa itu SekolahMap Jawa Timur?",
    answer:
      "SekolahMap Jawa Timur adalah platform interaktif untuk mengeksplorasi dan menganalisis data sekolah di seluruh wilayah Jawa Timur. Platform ini menyediakan visualisasi peta, grafik distribusi, dan tabel data lengkap yang dapat diakses secara gratis.",
  },
  {
    question: "Dari mana sumber data sekolah ini berasal?",
    answer:
      "Data sekolah bersumber dari API resmi yang terintegrasi dengan database pendidikan. Data diperbarui secara berkala untuk memastikan informasi yang akurat dan terkini mengenai sekolah-sekolah di Jawa Timur.",
  },
  {
    question: "Apakah saya bisa mengunduh data sekolah?",
    answer:
      "Ya, Anda dapat mengeksplorasi data melalui fitur peta interaktif dan tabel data. Untuk kebutuhan analisis lebih lanjut, Anda dapat mengakses data melalui fitur yang tersedia di platform kami.",
  },
  {
    question: "Bagaimana cara menggunakan fitur filter?",
    answer:
      "Fitur filter tersedia di halaman Peta dan Tabel. Anda dapat memfilter data berdasarkan kabupaten/kota, jenis sekolah (SD, SMP, SMA, SMK), dan status sekolah (Negeri/Swasta). Cukup pilih kriteria yang diinginkan dan data akan ditampilkan secara otomatis.",
  },
  {
    question: "Apakah data sekolah terupdate secara real-time?",
    answer:
      "Data diperbarui secara berkala sesuai dengan update dari sumber data. Kami berusaha menjaga agar informasi tetap akurat dan terkini. Tanggal update terakhir dapat dilihat di bagian informasi platform.",
  },
  {
    question: "Apakah platform ini gratis?",
    answer:
      "Ya, SekolahMap Jawa Timur dapat diakses secara gratis oleh siapa saja. Platform ini dikembangkan untuk mendukung transparansi dan kemudahan akses informasi pendidikan di Jawa Timur.",
  },
]

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-emerald-50/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-green-100 rounded-full mb-4">
            <HelpCircle className="w-4 h-4 text-green-700 mr-2" />
            <span className="text-green-700 font-semibold text-sm">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Pertanyaan yang Sering Diajukan</h2>
          <p className="text-slate-600 text-lg">Temukan jawaban untuk pertanyaan umum tentang platform kami</p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-emerald-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-emerald-50/50 transition-colors"
              >
                <span className="font-bold text-slate-800 text-lg pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-emerald-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 pt-2 text-slate-600 leading-relaxed border-t border-emerald-100">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
          <h3 className="text-xl font-bold text-slate-800 mb-2">Masih ada pertanyaan?</h3>
          <p className="text-slate-600 mb-4">
            Hubungi kami untuk informasi lebih lanjut tentang platform SekolahMap Jawa Timur
          </p>
          <a
            href="mailto:info@sekolahmap.id"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
          >
            Hubungi Kami
          </a>
        </div>
      </div>
    </section>
  )
}
