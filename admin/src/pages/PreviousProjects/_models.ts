type PreviousProject = {
  id: string;
  title: string;
  description: string;
  images: string[];
  htmlContent: HTMLElement;
};

type NewPreviousProject = {
  title: string;
  description: string;
  images: any;
};

type EditedPreviousProject = {
  id: string;
  title: string;
  description: string;
  images: any;
};
