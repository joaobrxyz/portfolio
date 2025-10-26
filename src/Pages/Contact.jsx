import React, { useState, useEffect, useRef } from "react";
import { Share2, User, Mail, MessageSquare, Send } from "lucide-react";
import SocialLinks from "../components/SocialLinks";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
// IMPORTANTE: Instale a biblioteca: npm install @emailjs/browser
import emailjs from '@emailjs/browser'; 

const ContactPage = () => {
    // 1. ADICIONADO: Referência do formulário para o EmailJS
    const formRef = useRef(null); 
    
    // Variáveis de estado
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false); 

    useEffect(() => {
        AOS.init({
            once: false,
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // NOVO HANDLESUBMIT: Usa as variáveis de ambiente
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Verifica a validação do formulário
        if (!formRef.current.checkValidity()) {
            return;
        }
        
        // 2. CARREGAMENTO SEGURO DAS CHAVES
        // Assumimos o prefixo VITE_ para a configuração do React/Vite
        const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
        const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
        const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY; 
        
        // Verificação de debug (se a chave não for encontrada)
        if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
            console.error("EmailJS Keys not loaded. Check VITE_ prefix and Vercel/Netlify settings.");
            Swal.fire({ title: 'Erro de Configuração', text: 'As chaves do EmailJS não foram carregadas. Verifique as variáveis de ambiente.', icon: 'error' });
            return;
        }

        setIsSubmitting(true);

        // 3. Loading Alert
        Swal.fire({
            title: 'Enviando Mensagem...',
            html: 'Por favor, aguarde enquanto sua mensagem é processada.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
        });

        try {
            // 4. Envio da Mensagem via EmailJS
            await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);

            // 5. Alerta de Sucesso
            Swal.fire({
                title: 'Sucesso!',
                text: 'Sua mensagem foi enviada com sucesso! Logo entrarei em contato.',
                icon: 'success',
                confirmButtonColor: '#6366f1',
                timer: 3000,
                timerProgressBar: true
            });

            // 6. Limpa o Formulário
            setFormData({
                name: "",
                email: "",
                message: "",
            });
            Swal.close(); 
            
        } catch (error) {
            console.error('EmailJS Error:', error);

            // 7. Alerta de Erro
            Swal.fire({
                title: 'Erro!',
                text: 'Ocorreu um erro ao enviar. Por favor, tente novamente mais tarde.',
                icon: 'error',
                confirmButtonColor: '#6366f1'
            });
            
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="px-[5%] sm:px-[5%] lg:px-[10%] " >
            <div className="text-center lg:mt-[5%] mt-10 mb-2 sm:px-0 px-[5%]">
                <h2
                    data-aos="fade-down"
                    data-aos-duration="1000"
                    className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
                  >
                    <span
                      style={{
                        color: "#6366f1",
                        backgroundImage:
                          "linear-gradient(45deg, #6366f1 10%, #a855f7 93%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        }}
                      >
                        Contato
                      </span>
                  </h2>
                  <p
                    data-aos="fade-up"
                    data-aos-duration="1100"
                    className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2"
                  >
                    Tem um projeto ou proposta? Envie uma mensagem e vamos conversar.
                  </p>
            </div>

            <div
              className="h-auto py-10 flex items-center justify-center 2xl:pr-[3.1%] lg:pr-[3.8%]  md:px-0"
              id="Contact"
            >
              <div className="container px-[1%] flex justify-center w-full" >
                <div
                    className="w-full max-w-3xl bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-5 py-10 sm:p-10 transform transition-all duration-500 hover:shadow-[#6366f1]/10"
                >
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                          Envie uma Mensagem
                        </h2>
                        <p className="text-gray-400">
                          Se tiver algo a conversar, preencha o formulário.
                        </p>
                      </div>
                      <Share2 className="w-10 h-10 text-[#6366f1] opacity-50" />
                    </div>

                    {/* FORMULÁRIO COM LÓGICA EMAILJS */}
                    <form 
                        ref={formRef} // ADICIONA A REFERÊNCIA
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div
                        data-aos="fade-up"
                        data-aos-delay="100"
                        className="relative group"
                      >
                          <User className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                          <input
                            type="text"
                            name="name" // NECESSÁRIO PARA EMAILJS
                            placeholder="Seu Nome"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 disabled:opacity-50"
                            required
                          />
                      </div>
                      <div
                        data-aos="fade-up"
                        data-aos-delay="200"
                        className="relative group"
                      >
                          <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                          <input
                            type="email"
                            name="email" // NECESSÁRIO PARA EMAILJS
                            placeholder="Seu Email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 disabled:opacity-50"
                            required
                          />
                      </div>
                      <div
                        data-aos="fade-up"
                        data-aos-delay="300"
                        className="relative group"
                      >
                          <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                          <textarea
                            name="message" // NECESSÁRIO PARA EMAILJS
                            placeholder="Mensagem"
                            value={formData.message}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="w-full resize-none p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 h-[9.9rem] disabled:opacity-50"
                            required
                          />
                      </div>
                      <button
                        data-aos="fade-up"
                        data-aos-delay="400"
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#6366f1]/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        <Send className="w-5 h-5" />
                        {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                      </button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-white/10 flex justify-center space-x-6">
                      <SocialLinks />
                    </div>
              </div>
              
              {/* BLOCO DE COMENTÁRIOS DESATIVADO */}
            </div>
          </div>
    </div>
  );
};

export default ContactPage;