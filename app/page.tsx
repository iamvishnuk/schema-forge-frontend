import {
  Code2,
  Database,
  GitBranch,
  Layers,
  RefreshCw,
  Shield,
  Terminal,
  Workflow,
  Zap
} from 'lucide-react';

import FeatureCard from '@/components/landingPage/FeatureCard';
import LandingFooter from '@/components/landingPage/LandingFooter';
import LandingHeader from '@/components/landingPage/LandingHeader';
import WorkflowStep from '@/components/landingPage/WorkflowStep';

export default function Home() {
  return (
    <div className='min-h-screen'>
      <LandingHeader />
      {/* Features Section */}
      <section
        id='features'
        className='container mx-auto px-6 py-24'
      >
        <h2 className='mb-16 text-center text-3xl font-bold dark:text-white'>
          Everything you need to build better schemas
        </h2>
        <div className='grid gap-8 md:grid-cols-3'>
          <FeatureCard
            icon={<Layers className='h-8 w-8 text-blue-500' />}
            title='Visual Schema Design'
            description='Drag-and-drop interface for creating and modifying MongoDB schemas with real-time validation.'
          />
          <FeatureCard
            icon={<Zap className='h-8 w-8 text-blue-500' />}
            title='Performance Insights'
            description='Get instant feedback on schema optimization and query performance recommendations.'
          />
          <FeatureCard
            icon={<Shield className='h-8 w-8 text-blue-500' />}
            title='Data Security'
            description='Built-in security best practices and validation rules to protect your data.'
          />
          <FeatureCard
            icon={<Code2 className='h-8 w-8 text-blue-500' />}
            title='Code Generation'
            description='Export schemas to MongoDB-native code, Mongoose models, or TypeScript interfaces.'
          />
          <FeatureCard
            icon={<GitBranch className='h-8 w-8 text-blue-500' />}
            title='Version Control'
            description='Track schema changes and collaborate with team members using built-in versioning.'
          />
          <FeatureCard
            icon={<Database className='h-8 w-8 text-blue-500' />}
            title='Database Migration'
            description='Generate migration scripts and safely deploy schema changes to production.'
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id='how-it-works'
        className='container mx-auto border-t border-gray-800 px-6 py-24'
      >
        <h2 className='mb-16 text-center text-3xl font-bold dark:text-white'>
          How SchemaForge Works
        </h2>
        <div className='grid gap-8 md:grid-cols-4'>
          <WorkflowStep
            icon={<Terminal className='h-8 w-8 text-blue-500' />}
            number={1}
            title='Connect'
            description='Connect to your existing MongoDB instance or start fresh with a new project.'
          />
          <WorkflowStep
            icon={<Workflow className='h-8 w-8 text-blue-500' />}
            number={2}
            title='Design'
            description='Use our visual editor to design your schema with drag-and-drop simplicity.'
          />
          <WorkflowStep
            icon={<RefreshCw className='h-8 w-8 text-blue-500' />}
            number={3}
            title='Validate'
            description='Get real-time validation and performance insights as you build.'
          />
          <WorkflowStep
            icon={<Code2 className='h-8 w-8 text-blue-500' />}
            number={4}
            title='Deploy'
            description='Generate production-ready code and deploy with confidence.'
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className='container mx-auto px-6 py-24 text-center'>
        <h2 className='mb-6 text-4xl font-bold dark:text-white'>
          Ready to build better schemas?
        </h2>
        <p className='mb-8 text-xl text-gray-600 dark:text-gray-300'>
          Start your free 14-day trial today. No credit card required.
        </p>
        <button className='rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 px-8 py-3 text-lg font-semibold text-white transition hover:cursor-pointer'>
          Get Started Now
        </button>
      </section>
      <LandingFooter />
    </div>
  );
}
