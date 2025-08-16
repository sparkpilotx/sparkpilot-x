import HelloQuerySamplesContainer from './hello-query';
import HelloMutationSamplesContainer from './hello-mutation';
import HelloSubscriptionSamplesContainer from './hello-subscription';
import IdeasSamplesContainer from './ideas';

/**
 * Properties for the SamplesContainer component.
 */
interface SamplesContainerProps {
  /** Additional CSS classes to apply to the container */
  className?: string;
}

/**
 * SamplesContainer component organizing all tRPC sample router demonstrations.
 * 
 * This main container component provides:
 * - Organized layout for multiple router sample containers
 * - Navigation between different router samples
 * - Consistent spacing and visual hierarchy
 * - Easy extensibility for future router sample additions
 * - Enhanced UI with shadcn/ui components
 * 
 * @param props - Component properties
 * @returns JSX element containing all router sample containers in an organized layout
 */
const SamplesContainer = ({ className }: SamplesContainerProps): React.JSX.Element => {
  return (
    <div className={`w-full min-h-screen bg-background ${className || ''}`}>
      {/* Router Samples */}
      <div className="space-y-12 px-6">
        {/* Hello Query Router Samples */}
        <section>
          <HelloQuerySamplesContainer />
        </section>

        {/* Hello Mutation Router Samples */}
        <section>
          <HelloMutationSamplesContainer />
        </section>

        {/* Hello Subscription Router Samples */}
        <section>
          <HelloSubscriptionSamplesContainer />
        </section>

        {/* Future Router Placeholders */}
        <section>
          <IdeasSamplesContainer />
        </section>
      </div>
    </div>
  );
};

export default SamplesContainer;