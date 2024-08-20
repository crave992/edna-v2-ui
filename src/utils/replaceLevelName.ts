import { TermInfoDto } from '@/dtos/OrganizationDto';

export const replaceLevelName = (levelName: string, termInfo?: TermInfoDto) => {
  if (termInfo) {
    switch (levelName) {
      case 'Nido':
        return termInfo.nido || levelName;
      case 'Toddler':
        return termInfo.toddler || levelName;
      case 'Nido Toddler':
        return termInfo.nidoToddler || levelName;
      case 'Primary':
        return termInfo.primary || levelName;
      case 'Elementary':
        return termInfo.elementary || levelName;
      case 'Lower Elementary':
        return termInfo.lowerElementary || levelName;
      case 'Upper Elementary':
        return termInfo.upperElementary || levelName;
      default:
        return levelName;
    }
  }
  return levelName;
};
