'use client'

import { motion } from 'framer-motion'

export default function Botanical() {
  return (
    <motion.div
      className="botanical"
      aria-hidden="true"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 0.12, x: 0 }}
      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
    >
      <svg viewBox="0 0 300 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M150 580 C148 480 145 380 155 280 C160 220 150 160 148 80" stroke="#4A6B5A" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M150 420 C120 400 80 380 60 340 C90 350 130 390 150 420Z" fill="#4A6B5A" opacity="0.7"/>
        <path d="M152 380 C185 360 220 340 240 300 C210 315 170 355 152 380Z" fill="#4A6B5A" opacity="0.5"/>
        <path d="M148 300 C115 280 75 265 55 225 C88 240 128 275 148 300Z" fill="#4A6B5A" opacity="0.6"/>
        <g transform="translate(148,80)">
          <path d="M0,-60 C-5,-30 -20,-10 -30,10 C-10,0 10,-15 0,-60Z" fill="#EDE7D8" stroke="#C9AA7C" strokeWidth="0.8"/>
          <path d="M0,-60 C5,-30 20,-10 30,10 C10,0 -10,-15 0,-60Z" fill="#EDE7D8" stroke="#C9AA7C" strokeWidth="0.8"/>
          <path d="M0,-60 C-20,-40 -40,-20 -40,5 C-20,-5 -5,-25 0,-60Z" fill="#F4EFE4" stroke="#C9AA7C" strokeWidth="0.8"/>
          <path d="M0,-60 C20,-40 40,-20 40,5 C20,-5 5,-25 0,-60Z" fill="#F4EFE4" stroke="#C9AA7C" strokeWidth="0.8"/>
          <path d="M0,-60 C-8,-30 -12,0 0,15 C12,0 8,-30 0,-60Z" fill="#EDE7D8" stroke="#C9AA7C" strokeWidth="0.8"/>
          <line x1="0" y1="-20" x2="-12" y2="-5" stroke="#A08558" strokeWidth="1"/>
          <line x1="0" y1="-20" x2="12" y2="-5" stroke="#A08558" strokeWidth="1"/>
          <line x1="0" y1="-20" x2="0" y2="-2" stroke="#A08558" strokeWidth="1"/>
          <circle cx="-12" cy="-5" r="3" fill="#C9AA7C"/>
          <circle cx="12" cy="-5" r="3" fill="#C9AA7C"/>
          <circle cx="0" cy="-2" r="3" fill="#C9AA7C"/>
        </g>
        <g transform="translate(178,200) rotate(30)">
          <path d="M0,-40 C-4,-20 -14,-8 -20,6 C-7,0 7,-10 0,-40Z" fill="#EDE7D8" stroke="#C9AA7C" strokeWidth="0.7"/>
          <path d="M0,-40 C4,-20 14,-8 20,6 C7,0 -7,-10 0,-40Z" fill="#EDE7D8" stroke="#C9AA7C" strokeWidth="0.7"/>
          <path d="M0,-40 C-14,-28 -28,-14 -28,4 C-14,-3 -4,-18 0,-40Z" fill="#F4EFE4" stroke="#C9AA7C" strokeWidth="0.7"/>
          <path d="M0,-40 C14,-28 28,-14 28,4 C14,-3 4,-18 0,-40Z" fill="#F4EFE4" stroke="#C9AA7C" strokeWidth="0.7"/>
        </g>
        <g transform="translate(125,160) rotate(-15)">
          <path d="M0,0 C-6,-15 -8,-30 0,-45 C8,-30 6,-15 0,0Z" fill="#EDE7D8" stroke="#C9AA7C" strokeWidth="0.7"/>
          <path d="M0,0 C-10,-10 -14,-25 -8,-40 C-2,-25 4,-10 0,0Z" fill="#EDE7D8" stroke="#C9AA7C" strokeWidth="0.6" opacity="0.7"/>
          <path d="M0,0 C10,-10 14,-25 8,-40 C2,-25 -4,-10 0,0Z" fill="#EDE7D8" stroke="#C9AA7C" strokeWidth="0.6" opacity="0.7"/>
        </g>
      </svg>
    </motion.div>
  )
}
