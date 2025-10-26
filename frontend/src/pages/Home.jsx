import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DollarSign,
  TrendingUp, 
  PieChart, 
  Bell, 
  Shield, 
  Zap, 
  Target,
  ArrowRight,
  ChevronRight,
  Star,
  Twitter,
  Linkedin,
  Github,
  BarChart3,
  Sparkles
} from 'lucide-react';

const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/80 backdrop-blur-lg border-b border-slate-800' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-blue-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent pb-2">
              Incite Insight
            </span>
          </div>
            <div className="flex items-center gap-3">
              <Button className="bg-gradient-to-br from-pink-600 to-blue-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-slate-300">Your financial clarity starts here</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Transform Your
                <span className="block font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Financial Future
                </span>
              </h1>
              
              <p className="text-xl text-slate-400 leading-relaxed">
                Take control of your spending with intelligent insights and real-time tracking. 
                Make every dollar count with Incite Insight.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="font-bold bg-gradient-to-r from-pink-600 to-blue-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-slate-700 text-slate-500 hover:bg-slate-800 hover:text-white text-lg">
                  Devpost
                </Button>
              </div>

            
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-3xl blur-3xl"></div>
              <Card className="relative bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-slate-400">Monthly Savings</div>
                        <div className="text-3xl font-bold text-white">$2,060</div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                        +7%
                      </div>
                    </div>
                    
                    <div className="h-32 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-emerald-500/20 rounded-xl flex items-end justify-around p-4">
                      {[40, 65, 45, 80, 55, 70, 60].map((height, i) => (
                        <div 
                          key={i} 
                          className="w-8 font-bold bg-gradient-to-r from-pink-600 to-blue-600 rounded-t"
                          style={{ height: `${height}%` }}
                        ></div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-800/50 rounded-xl">
                        <div className="text-sm text-slate-400">Income</div>
                        <div className="text-xl font-bold text-emerald-400">$5,240</div>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-xl">
                        <div className="text-sm text-slate-400">Expenses</div>
                        <div className="text-xl font-bold text-blue-400">$3,180</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-slate-500 text-sm mb-8">Created by</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {['Sami Najib', 'Hector Ramos', 'Matthew Dzirko', 'Luke Crouse'].map((company) => (
              <div key={company} className="text-2xl font-bold text-slate-600">{company}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features for Smart Budgeting</h2>
            <p className="text-xl text-slate-400">Everything you need to master your finances</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Real-time Tracking',
                description: 'Monitor your spending as it happens with live updates and instant notifications'
              },
              {
                icon: Target,
                title: 'Smart Budgeting',
                description: 'Set intelligent budgets that adapt to your spending patterns and goals'
              },
              {
                icon: BarChart3,
                title: 'Insights & Analytics',
                description: 'Get actionable insights with beautiful charts and detailed spending analysis'
              },
              {
                icon: PieChart,
                title: 'Category Management',
                description: 'Organize expenses with customizable categories and automatic tagging'
              }
            ].map((feature, i) => (
              <Card key={i} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:bg-slate-900/80 transition-all duration-300 group">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-slate-400">Get started in minutes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Link your finances',
                description: 'Link your finances in seconds by uploading your transaction history.'
              },
              {
                step: '02',
                title: 'Analyze your progress',
                description: 'Easily visualize your spending habits.'
              },
              {
                step: '03',
                title: 'Track & Optimize',
                description: 'Monitor spending, get insights, and make better financial decisions'
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-slate-800 mb-4">{item.step}</div>
                <h3 className="text-2xl font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.description}</p>
                {i < 2 && (
                  <ChevronRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-slate-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Incite Insight</h2>
            <p className="text-xl text-slate-400">Built for modern financial management</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'Save Money',
                description: 'Identify wasteful spending and save an average of $500/month',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: Shield,
                title: 'Stay on Budget',
                description: 'Get alerts before overspending and maintain financial discipline',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Bell,
                title: 'Make Informed Decisions',
                description: 'Data-driven insights help you understand where your money goes',
                gradient: 'from-emerald-500 to-teal-500'
              }
            ].map((benefit, i) => (
              <Card key={i} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-all duration-300">
                <CardContent className="p-8 space-y-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${benefit.gradient} opacity-20 rounded-2xl flex items-center justify-center`}>
                    <benefit.icon className={`w-7 h-7 bg-gradient-to-br ${benefit.gradient} bg-clip-text text-transparent`} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{benefit.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 pb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-blue-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
              Incite Insight
            </span>
          </div>
              <p className="text-slate-400 mb-4">Empowering financial clarity through intelligent insights.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5 text-slate-400" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5 text-slate-400" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                  <Github className="w-5 h-5 text-slate-400" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
            © 2025 Incite Insight. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;