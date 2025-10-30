import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="mb-4 text-4xl font-bold">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
        <div>
          <Link to="/sticker-sheet">
            <Button size="lg">View Component Sticker Sheet</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
