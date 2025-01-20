import { Cloud, Server } from 'lucide-react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import KeyFeatures from '@/components/KeyFeatures';
import Pricing from '@/components/Pricing';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1'>
        <section className='w-full bg-blue-50 py-12 md:py-24 lg:py-32 xl:py-48'>
          <div className='container mx-auto px-4 md:px-6'>
            <div className='flex flex-col items-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none'>
                  Design Any Database with Ease
                </h1>
                <p className='mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl'>
                  Create, collaborate, and share your database schemas
                  effortlessly with our intuitive ER diagram tool. Support for
                  both SQL and NoSQL databases.
                </p>
              </div>
              <div className='space-x-4'>
                <Button className='bg-blue-600 text-white duration-300 hover:bg-blue-700'>
                  Get Started
                </Button>
                <Button
                  variant='outline'
                  className='duration-300'
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        <KeyFeatures />

        <section className='w-full bg-gray-50 py-12 md:py-24 lg:py-32'>
          <div className='container mx-auto px-4 md:px-6'>
            <h2 className='mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              Supports All Major Database Types
            </h2>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
              <div className='flex flex-col items-center rounded-lg bg-white p-6 shadow-lg'>
                <Server className='mb-4 h-12 w-12 text-blue-600' />
                <h3 className='mb-2 text-2xl font-bold'>SQL Databases</h3>
                <p className='text-center text-gray-500'>
                  Design schemas for relational databases like MySQL,
                  PostgreSQL, Oracle, and Microsoft SQL Server.
                </p>
              </div>
              <div className='flex flex-col items-center rounded-lg bg-white p-6 shadow-lg'>
                <Cloud className='mb-4 h-12 w-12 text-blue-600' />
                <h3 className='mb-2 text-2xl font-bold'>NoSQL Databases</h3>
                <p className='text-center text-gray-500'>
                  Create flexible schemas for document stores, key-value
                  databases, and graph databases like MongoDB, Cassandra, and
                  Neo4j.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Pricing />

        <Footer />
      </main>
    </div>
  );
}
